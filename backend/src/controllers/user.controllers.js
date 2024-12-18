import { User } from "../models/users.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponce.js";
import jwt from "jsonwebtoken";

// Generate access and refresh tokens
const genrateAccessAndRefreshToken = async (userId) => {
    try {
        // Ensure the user exists
        const user = await User.findById(userId);
        if (!user) {
            throw new ApiError(404, "User not found");
        }

        // Generate tokens
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        // Save the refresh token to the user document
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Error generating tokens: " + error.message);
    }
};

// User registration
const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validate input fields
        if (!username || !email || !password) {
            return res.status(400).json({ error: "Please provide all required fields" });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters long" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        // Create new user
        const user = await User.create({ username, email, password });
        res.status(201).json({ message: "User registered successfully", user });
    } catch (error) {
        //console.error(error);
        res.status(500).json({ error: "Server Error" });
    }
};

// User login
const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Validate user credentials
        const user = await User.findOne({ username });
        if (!user || !(await user.isPasswordCorrect(password))) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        //console.log(user);
        
        // Await the token generation to get the actual string
        const accessToken = await user.generateAccessToken(); // Ensure this generates a valid token
        const refreshToken = await user.generateRefreshToken(); // Same for refresh token

       //console.log('AccessToken:', accessToken); // Log the actual token string
       // console.log('RefreshToken:', refreshToken); // Log the actual token string

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        };

        // Send response
        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json({
                message: 'Login successful',
                user: { username: user.username, email: user.email, userId: user.id},
                accessToken,  // This should now be the actual JWT string
                refreshToken, // This should now be the actual JWT string
            });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server Error" });
    }
};

  

// User logout
const logout = async (req, res) => {
    try {
        // Clear refresh token from user
        await User.findByIdAndUpdate(req.user._id, { refreshToken: "" }, { new: true });

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        };

        return res
            .status(200)
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .json({ message: "User logged out" });
    } catch (error) {
        //console.error(error);
        res.status(500).json({ error: "Something went wrong while logging out" });
    }
};

const getCurrentUser = async (req, res) => {
    try {
        return res
  .status(200)
  .json({"data":req.user})
    } catch (error) {
        //console.error(error);
        res.status(500).json({ error: "Something went wrong while get current user" });
    }
}

// Refresh access token
const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized: No refresh token provided");
    }

    try {
        // Verify refresh token
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
        
        const user = await User.findById(decodedToken._id);
        if (!user) {
           // console.error(`User not found for id: ${decodedToken._id}`);
            throw new ApiError(401, "Invalid refresh token: User not found");
        }

        if (incomingRefreshToken !== user.refreshToken) {
            //console.error(`Refresh token mismatch for user: ${user._id}`);
            throw new ApiError(403, "Refresh token is invalid or expired");
        }

        // Generate new access and refresh tokens
        const { accessToken, refreshToken: newRefreshToken } = await genrateAccessAndRefreshToken(user._id);

        // Update user's refresh token in the database
        user.refreshToken = newRefreshToken;
        await user.save({ validateBeforeSave: false });

        // Set cookies and return response
        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production"
        };

        res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(new ApiResponse(
                200,
                { accessToken, refreshToken: newRefreshToken },
                "Access token refreshed successfully"
            ));

    } catch (error) {
        //console.error("Error in refreshAccessToken:", error);
        if (error instanceof jwt.JsonWebTokenError) {
            throw new ApiError(401, "Invalid refresh token: " + error.message);
        }
        throw new ApiError(500, error.message || "Error refreshing access token");
    }
});

export { register, login, logout,refreshAccessToken , getCurrentUser};
