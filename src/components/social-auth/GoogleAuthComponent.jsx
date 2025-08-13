import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { useEffect, useState } from "react"
import { auth } from "../../firebase/firebase.config";
import { useLoginMutation, useRegisterMutation } from "../../features/auth/authSlide";
import secureLocalStorage from "react-secure-storage";
import { getDecryptAccessToken, storeAccessToken } from "../../utils/tokenUtils";

export const useLoginWithGoogle = () => {
    // setup login, popup, logout
    const [error, setError] = useState();
    // pending
    const [pending, setIsPending] = useState(false);
    // data (user credential)
    const [user, setUser] = useState(null);
    // create provider
    const provider = new GoogleAuthProvider();

    // calling signup slice 
    const [signUpRequest, { error: signUpError }] = useRegisterMutation();

    //calling login slice
    const [loginRequest, { data }] = useLoginMutation();

    // useEffect tracking on user credential 
    useEffect(() => {
        const unsubriber = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                throw new Error("unsubscribe user")
            }
        })
        return () => unsubriber();

    }, [])

    // setup login with github 
    const loginWithGoogle = async () => {
        setIsPending(true);
        try {
            const res = await signInWithPopup(auth, provider);
            if (!res) {
                throw new Error("login unsuccessfully");
            }
            const user = res.user;
            console.log("Google Info: ", user)
            

            //implement signup with api 
            try {
                await signUpRequest({
                    username: "nJohn"+user?.displayName.substring(0, 3),
                    phoneNumber: user?.phoneNumber,
                    address: {
                        addressLine1: "",
                        addressLine2: "",
                        road: "",
                        linkAddress: ""
                    },
                    email: user?.email,
                    password: `${user?.displayName.substring(0, 3)}${import.meta.env.VITE_SECRET_KEY}`,
                    confirmPassword: `${user?.displayName.substring(0, 3)}${import.meta.env.VITE_SECRET_KEY}`,
                    profile: user?.photoURL
                }).unwrap();
                if (!data) {
                    console.log("SignUp Failed")
                }
                const res = data.json();
                console.log("Response: ", res);
                console.log("=====> ", signUpError.code.status)


            } catch (error) {
                console.log("======> error signup : ", error)
                const checkAuth = error.status;

                if (checkAuth == 400 || checkAuth == 200) {
                    await loginRequest({
                        email: user?.email,
                        password: `${user?.displayName.substring(0, 3)}${import.meta.env.VITE_SECRET_KEY}`
                    }).unwrap();

                    if (!data) {
                        console.log("Login isn't success")
                    }
                    console.log(data)
                    // const response =await  data.json();
                    console.log("======>user data after login", data.accessToken)

                    //implement to store accessToken in local secure storage
                    if(data.accessToken){
                      // const ENCRYPT_KEY  = import.meta.env.VITE_ENCRYPTED_KEY || "teco-accesstoken";
                      // secureLocalStorage.setItem(ENCRYPT_KEY, data?. accessToken);
                      storeAccessToken(data?.accessToken)
                      console.log("====> AfterDecrypted: ", getDecryptAccessToken())
                      Navigate("/products")

                    }
                    if(!data.accessToken){
                      Navigate("/login")
                    }
                }


            }

            setIsPending(false);

        } catch (error) {
            setError(error)
            console.log(error.message)
            setIsPending(false)
        }
    }

    //logout features 
    const googleLogout = async () => {

        setIsPending(false);
        setError(null);
        try {
            await signOut(auth);
            setIsPending(true);
            console.log("Logout successfully!")
        } catch (error) {
            setError(error);
            console.log(error.message);
            setIsPending(false);
        }

    }

    return { googleLogout, loginWithGoogle, pending, error, user };
}
