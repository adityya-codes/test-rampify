import db from "@repo/db/client";
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt";

export const authOptions = {
    providers: [
      CredentialsProvider({
          name: 'Credentials',
          credentials: {
            phone: { label: "Phone number", type: "text", placeholder: "1231231231" },
            password: { label: "Password", type: "password" }
          },
          // TODO: User credentials type from next-aut
          async authorize(credentials: any) {
            try {
              console.error("=== AUTHORIZE START ===");
              console.error("Credentials:", credentials);

              // Do zod validation, OTP validation here
              const hashedPassword = await bcrypt.hash(credentials.password, 10);

              console.error("Before findFirst");

              const existingUser = await db.user.findFirst({
                  where: {
                      number: credentials.phone
                  }
              });

              console.error("After findFirst");
              console.error("Existing User:", existingUser);

              if (existingUser) {
                  console.error("User exists, checking password");

                  const passwordValidation = await bcrypt.compare(
                    credentials.password,
                    existingUser.password
                  );

                  console.error("Password validation:", passwordValidation);

                  if (passwordValidation) {
                      console.error("LOGIN SUCCESS");

                      return {
                          id: existingUser.id.toString(),
                          name: existingUser.name,
                          email: existingUser.number
                      }
                  }

                  console.error("PASSWORD FAILED");
                  return null;
              }

              console.error("USER NOT FOUND, CREATING USER");

              try {
                  const user = await db.user.create({
                      data: {
                          number: credentials.phone,
                          password: hashedPassword
                      }
                  });

                  console.error("USER CREATED:", user);

                  return {
                      id: user.id.toString(),
                      name: user.name,
                      email: user.number
                  }
              } catch(e) {
                  console.error("CREATE USER ERROR:", e);
              }

              return null;

            } catch (e) {
              console.error("AUTHORIZE ERROR:", e);
              throw e;
            }
          },
        })
    ],
    secret: process.env.NEXTAUTH_SECRET ?? process.env.JWT_SECRET,
    callbacks: {
        // TODO: can u fix the type here? Using any is bad
        async session({ token, session }: any) {
            session.user.id = token.sub

            return session
        }
    }
}