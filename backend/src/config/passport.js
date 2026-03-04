import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as MicrosoftStrategy } from "passport-microsoft";
import passport from "passport";
import User from "../models/User.js";

const configurePassport = () => {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: "/api/auth/google/callback",
                proxy: true,
            },
            async (accessToken, refreshToken, profile, done) => {
                const { id, displayName, emails, photos } = profile;
                const email = emails[0].value;

                try {
                    let user = await User.findOne({
                        $or: [{ googleId: id }, { email }]
                    });

                    if (user) {
                        // If user exists but doesn't have googleId linked yet
                        if (!user.googleId) {
                            user.googleId = id;
                            await user.save();
                        }
                        return done(null, user);
                    }

                    // Create new user if doesn't exist
                    user = await User.create({
                        name: displayName,
                        email: email,
                        googleId: id,
                        profilePic: photos && photos.length > 0 ? photos[0].value : "",
                    });

                    return done(null, user);
                } catch (error) {
                    return done(error, null);
                }
            }
        )
    );

    passport.use(
        new MicrosoftStrategy(
            {
                clientID: process.env.MICROSOFT_CLIENT_ID,
                clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
                callbackURL: "/api/auth/microsoft/callback",
                scope: ["user.read"],
                tenant: process.env.MICROSOFT_TENANT_ID || "common",
                proxy: true,
            },
            async (accessToken, refreshToken, profile, done) => {
                const { id, displayName, emails } = profile;
                const email = emails && emails.length > 0 ? emails[0].value : null;

                try {
                    // Try to find by microsoftId or email
                    let query = { microsoftId: id };
                    if (email) {
                        query = { $or: [{ microsoftId: id }, { email }] };
                    }

                    let user = await User.findOne(query);

                    if (user) {
                        if (!user.microsoftId) {
                            user.microsoftId = id;
                            await user.save();
                        }
                        return done(null, user);
                    }

                    // Create new user if not found
                    user = await User.create({
                        name: displayName,
                        email: email, // Might be null for some MS accounts if not permitted, but usually present
                        microsoftId: id,
                    });

                    return done(null, user);
                } catch (error) {
                    return done(error, null);
                }
            }
        )
    );

    // Standard Passport serialization (not strictly needed for JWT, but good practice)
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (error) {
            done(error, null);
        }
    });
};

export default configurePassport;
