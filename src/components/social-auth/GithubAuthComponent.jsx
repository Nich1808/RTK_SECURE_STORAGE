import {
  GithubAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut
} from "firebase/auth";
import { useEffect, useState } from "react";
import SecureStorage from "react-secure-storage";
import { auth } from "../../firebase/firebase.config";
import { useLoginMutation, useRegisterMutation } from "../../features/auth/authSlide";

export const useLoginWithGitHub = () => {
  const [error, setError] = useState(null);
  const [pending, setIsPending] = useState(false);
  const [user, setUser] = useState(null);
  const provider = new GithubAuthProvider();

  const [signUpRequest] = useRegisterMutation();
  const [loginRequest] = useLoginMutation();

  // Clean username to match backend regex
  const cleanUsername = (name) => {
    return (name || "github_user").replace(/[^A-Za-z0-9._-]/g, "_");
  };

  // Generate strong password to match backend rules
  const generateStrongPassword = () => {
    return "Aa1@" + Math.random().toString(36).slice(-8) + "@";
  };

  // On mount: load token from secure storage and listen to auth state
  useEffect(() => {
    const storedToken = SecureStorage.getItem("accessToken");
    if (storedToken) {
      console.log("Loaded access token from secure storage:", storedToken);
      // Optionally refresh user info or keep session alive here
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser || null);
      if (!firebaseUser) {
        // Clear token on logout
        SecureStorage.removeItem("accessToken");
      }
    });

    return () => unsubscribe();
  }, []);

  const loginWithGitHub = async () => {
    setIsPending(true);
    setError(null);
    try {
      const res = await signInWithPopup(auth, provider);
      if (!res) throw new Error("Login unsuccessfully");

      let githubUser = res.user;
      console.log("GitHub Info:", githubUser);

      // If Firebase doesn't provide email, fetch from GitHub API using token
      if (!githubUser.email) {
        const token = GithubAuthProvider.credentialFromResult(res)?.accessToken;
        if (token) {
          const emailResponse = await fetch("https://api.github.com/user/emails", {
            headers: { Authorization: `token ${token}` }
          });
          const emails = await emailResponse.json();
          const primaryEmail = emails.find(e => e.primary)?.email || emails[0]?.email;
          githubUser = { ...githubUser, email: primaryEmail };
        }
      }

      // Get Firebase ID token (access token)
      const accessToken = await githubUser.getIdToken();
      // Save token securely
      SecureStorage.setItem("accessToken", accessToken);

      const username = cleanUsername(githubUser?.displayName || githubUser?.email);
      const password = generateStrongPassword();

      try {
        // Try to register
        const signUpData = await signUpRequest({
          username,
          phoneNumber: githubUser?.phoneNumber || "",
          address: {
            addressLine1: "",
            addressLine2: "",
            road: "",
            linkAddress: ""
          },
          email: githubUser?.email,
          password,
          confirmPassword: password,
          profile: githubUser?.photoURL
        }).unwrap();

        console.log("SignUp Success:", signUpData);
      } catch (signUpErr) {
        console.warn("SignUp Failed:", signUpErr);

        // If user exists, try to login
        if (signUpErr?.status === 400 || signUpErr?.status === 200) {
          try {
            const loginData = await loginRequest({
              email: githubUser?.email,
              password
            }).unwrap();

            console.log("Login Success:", loginData);
          } catch (loginErr) {
            console.error("Login Failed:", loginErr);
          }
        }
      }

      setUser(githubUser);
    } catch (err) {
      setError(err);
      console.error(err.message);
    } finally {
      setIsPending(false);
    }
  };

  const githubLogout = async () => {
    setError(null);
    setIsPending(true);
    try {
      await signOut(auth);
      setUser(null);
      SecureStorage.removeItem("accessToken");
      console.log("Logout successfully!");
    } catch (err) {
      setError(err);
      console.error(err.message);
    } finally {
      setIsPending(false);
    }
  };

  return { githubLogout, loginWithGitHub, pending, error, user };
};
