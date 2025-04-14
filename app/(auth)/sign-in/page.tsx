"use client";

import { signIn } from "better-auth";

export default function SignIn() {
    return <button onClick={() => signIn()}>Sign In</button>;
}
