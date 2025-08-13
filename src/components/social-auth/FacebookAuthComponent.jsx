import {
  FacebookAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../../firebase/firebase.config";
import { useLoginMutation, useRegisterMutation } from "../../features/auth/authSlide";

const generateStrongPassword = () => {
  return "Aa1@" + Math.random().toString(36).slice(-8) + "@";
};

export const useLoginWithFacebook = () => {
  const [error, setError] = useState(null);
  const [pending, setIsPending] = useState(false);
  const [user, setUser] = useState(null);

  const provider = new FacebookAuthProvider();
  provider.addScope("email");

  const [signUpRequest] = useRegisterMutation();
  const [loginRequest] = useLoginMutation();

  // Clean username from name or email for backend
  const cleanUsername = (name) => {
    return (name || "facebook_user").replace(/[^A-Za-z0-9._-]/g, "_");
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser || null);
    });
    return () => unsubscribe();
  }, []);

  const loginWithFacebook = async () => {
    setIsPending(true);
    setError(null);

    try {
      const res = await signInWithPopup(auth, provider);
      if (!res) throw new Error("Login unsuccessfully");
      

      const firebaseUser = res.user;
      const credential = FacebookAuthProvider.credentialFromResult(res);
      const accessToken = credential?.accessToken;

      let email = firebaseUser.email;
      let name = firebaseUser.displayName;
      let avatar = firebaseUser.photoURL || "";

      if ((!email || !name) && accessToken) {
        const fbRes = await fetch(
          `https://graph.facebook.com/me?fields=name,email,picture.type(large)&access_token=${accessToken}`
        );

        if (!fbRes.ok) {
          throw new Error("Failed to fetch Facebook profile data");
        }

        const fbData = await fbRes.json();
        email = email || fbData.email;
        name = name || fbData.name;
        if (!avatar && fbData.picture?.data?.url) {
          avatar = fbData.picture.data.url;
        }
      }

      if (!email || !name) {
        throw new Error("Email and name are required from Facebook login");
      }

      const username = cleanUsername(name);
      const password = generateStrongPassword();

      try {
        // Try to register user first
        const signUpData = await signUpRequest({
          username,
          phoneNumber: firebaseUser.phoneNumber || "",
          address: {
            addressLine1: "",
            addressLine2: "",
            road: "",
            linkAddress: ""
          },
          email,
          password,
          confirmPassword: password,
          profile: avatar
        }).unwrap();

        console.log("SignUp Success:", signUpData);
      } catch (signUpErr) {
        console.warn("SignUp Failed:", signUpErr);

        // If user exists, try login
        if (signUpErr?.status === 400 || signUpErr?.status === 200) {
          try {
            const loginData = await loginRequest({
              email,
              password
            }).unwrap();
            console.log("Login Success:", loginData);
          } catch (loginErr) {
            console.error("Login Failed:", loginErr);
          }
        }
      }

      setUser(firebaseUser);
    } catch (err) {
      setError(err);
      console.error(err);
    } finally {
      setIsPending(false);
    }
  };

  const facebookLogout = async () => {
    setIsPending(true);
    setError(null);
    try {
      await signOut(auth);
      setUser(null);
      console.log("Logout successfully!");
    } catch (err) {
      setError(err);
      console.error(err);
    } finally {
      setIsPending(false);
    }
  };

  return { facebookLogout, loginWithFacebook, pending, error, user };
};
