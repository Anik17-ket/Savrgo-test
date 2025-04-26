// const express = require("express")
// const mongoose = require("mongoose")
// const cors = require("cors")
// const bcrypt = require("bcryptjs")
// const jwt = require("jsonwebtoken")
// const app = express()
// const PORT = 5000
// const SECRET_KEY = "Aniket@2004"

// // Middleware
// app.use(cors())
// app.use(express.json())

// // MongoDB Connection
// mongoose
//   .connect("mongodb://localhost:27017/savrgo", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("MongoDB Connected"))
//   .catch((err) => console.log("MongoDB Connection Error:", err))

// // User Schema
// const UserSchema = new mongoose.Schema({
//   fullName: {
//     type: String,
//     required: true,
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   password: {
//     type: String,
//     required: true,
//   },
//   userType: {
//     type: String,
//     enum: ["business", "customer"],
//     required: true,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// })

// // Deal Schema
// const DealSchema = new mongoose.Schema({
//   businessId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },
//   businessName: {
//     type: String,
//     required: true,
//   },
//   title: {
//     type: String,
//     required: true,
//   },
//   description: {
//     type: String,
//     required: true,
//   },
//   category: {
//     type: String,
//     enum: ["fashion", "restaurant", "electronics", "movies", "travel", "other"],
//     required: true,
//   },
//   discount: {
//     type: String,
//     required: true,
//   },
//   originalPrice: {
//     type: Number,
//     required: true,
//   },
//   discountedPrice: {
//     type: Number,
//     required: true,
//   },
//   location: {
//     type: String,
//     required: true,
//   },
//   validUntil: {
//     type: Date,
//     required: true,
//   },
//   promoCode: {
//     type: String,
//   },
//   image: {
//     type: String,
//     default: "https://via.placeholder.com/150",
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
//   savedBy: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//     },
//   ],
// })

// const User = mongoose.model("User", UserSchema)
// const Deal = mongoose.model("Deal", DealSchema)

// // Authentication Middleware
// const auth = (req, res, next) => {
//   const token = req.header("x-auth-token")
//   if (!token) return res.status(401).json({ msg: "No token, authorization denied" })

//   try {
//     const decoded = jwt.verify(token, SECRET_KEY)
//     req.user = decoded
//     next()
//   } catch (err) {
//     res.status(401).json({ msg: "Token is not valid" })
//   }
// }

// // Routes
// // Register User
// app.post("/api/users/register", async (req, res) => {
//   const { fullName, email, password, userType } = req.body

//   try {
//     let user = await User.findOne({ email })
//     if (user) {
//       return res.status(400).json({ msg: "User already exists" })
//     }

//     user = new User({
//       fullName,
//       email,
//       password,
//       userType,
//     })

//     // Hash password
//     const salt = await bcrypt.genSalt(10)
//     user.password = await bcrypt.hash(password, salt)

//     await user.save()

//     // Create JWT
//     const payload = {
//       user: {
//         id: user.id,
//         email: user.email,
//         fullName: user.fullName,
//         userType: user.userType,
//       },
//     }

//     jwt.sign(payload, SECRET_KEY, { expiresIn: "5d" }, (err, token) => {
//       if (err) throw err
//       res.json({ token, user: payload.user })
//     })
//   } catch (err) {
//     console.error(err.message)
//     res.status(500).send("Server error")
//   }
// })

// // Login User
// app.post("/api/users/login", async (req, res) => {
//   const { email, password } = req.body

//   try {
//     const user = await User.findOne({ email })
//     if (!user) {
//       return res.status(400).json({ msg: "Invalid Credentials" })
//     }

//     const isMatch = await bcrypt.compare(password, user.password)
//     if (!isMatch) {
//       return res.status(400).json({ msg: "Invalid Credentials" })
//     }

//     // Create JWT
//     const payload = {
//       user: {
//         id: user.id,
//         email: user.email,
//         fullName: user.fullName,
//         userType: user.userType,
//       },
//     }

//     jwt.sign(payload, SECRET_KEY, { expiresIn: "5d" }, (err, token) => {
//       if (err) throw err
//       res.json({ token, user: payload.user })
//     })
//   } catch (err) {
//     console.error(err.message)
//     res.status(500).send("Server error")
//   }
// })

// // Create Deal
// app.post("/api/deals", auth, async (req, res) => {
//   const {
//     title,
//     description,
//     category,
//     discount,
//     originalPrice,
//     discountedPrice,
//     location,
//     validUntil,
//     promoCode,
//     image,
//   } = req.body

//   try {
//     const user = await User.findById(req.user.user.id)

//     if (user.userType !== "business") {
//       return res.status(403).json({ msg: "Only businesses can create deals" })
//     }

//     const newDeal = new Deal({
//       businessId: req.user.user.id,
//       businessName: user.fullName,
//       title,
//       description,
//       category,
//       discount,
//       originalPrice,
//       discountedPrice,
//       location,
//       validUntil,
//       promoCode,
//       image: image || "https://via.placeholder.com/150",
//     })

//     const deal = await newDeal.save()
//     res.json(deal)
//   } catch (err) {
//     console.error(err.message)
//     res.status(500).send("Server error")
//   }
// })

// // Get All Deals
// app.get("/api/deals", async (req, res) => {
//   try {
//     const { category } = req.query
//     const query = {}

//     if (category && category !== "all") {
//       query.category = category
//     }

//     const deals = await Deal.find(query).where("validUntil").gt(new Date()).sort({ createdAt: -1 })

//     res.json(deals)
//   } catch (err) {
//     console.error(err.message)
//     res.status(500).send("Server error")
//   }
// })

// // Get Business Deals
// app.get("/api/business/deals", auth, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.user.id)

//     if (user.userType !== "business") {
//       return res.status(403).json({ msg: "Not authorized" })
//     }

//     const deals = await Deal.find({ businessId: req.user.user.id }).sort({ createdAt: -1 })

//     res.json(deals)
//   } catch (err) {
//     console.error(err.message)
//     res.status(500).send("Server error")
//   }
// })

// // Get Deal by ID
// app.get("/api/deals/:id", async (req, res) => {
//   try {
//     const deal = await Deal.findById(req.params.id)

//     if (!deal) {
//       return res.status(404).json({ msg: "Deal not found" })
//     }

//     res.json(deal)
//   } catch (err) {
//     console.error(err.message)
//     if (err.kind === "ObjectId") {
//       return res.status(404).json({ msg: "Deal not found" })
//     }
//     res.status(500).send("Server error")
//   }
// })

// // Save Deal
// app.post("/api/deals/:id/save", auth, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.user.id)

//     if (user.userType !== "customer") {
//       return res.status(403).json({ msg: "Only customers can save deals" })
//     }

//     const deal = await Deal.findById(req.params.id)

//     if (!deal) {
//       return res.status(404).json({ msg: "Deal not found" })
//     }

//     // Check if already saved
//     if (deal.savedBy.includes(req.user.user.id)) {
//       return res.status(400).json({ msg: "Deal already saved" })
//     }

//     deal.savedBy.push(req.user.user.id)
//     await deal.save()

//     res.json({ msg: "Deal saved successfully" })
//   } catch (err) {
//     console.error(err.message)
//     res.status(500).send("Server error")
//   }
// })

// // Unsave Deal
// app.delete("/api/deals/:id/save", auth, async (req, res) => {
//   try {
//     const deal = await Deal.findById(req.params.id)

//     if (!deal) {
//       return res.status(404).json({ msg: "Deal not found" })
//     }

//     // Remove user from savedBy array
//     const removeIndex = deal.savedBy.indexOf(req.user.user.id)

//     if (removeIndex === -1) {
//       return res.status(400).json({ msg: "Deal not saved by user" })
//     }

//     deal.savedBy.splice(removeIndex, 1)
//     await deal.save()

//     res.json({ msg: "Deal unsaved successfully" })
//   } catch (err) {
//     console.error(err.message)
//     res.status(500).send("Server error")
//   }
// })

// // Get Saved Deals
// app.get("/api/deals/saved/me", auth, async (req, res) => {
//   try {
//     const deals = await Deal.find({ savedBy: req.user.user.id })
//       .where("validUntil")
//       .gt(new Date())
//       .sort({ createdAt: -1 })

//     res.json(deals)
//   } catch (err) {
//     console.error(err.message)
//     res.status(500).send("Server error")
//   }
// })

// // Delete Deal
// app.delete("/api/deals/:id", auth, async (req, res) => {
//   try {
//     const deal = await Deal.findById(req.params.id)

//     if (!deal) {
//       return res.status(404).json({ msg: "Deal not found" })
//     }

//     // Check if user owns the deal
//     if (deal.businessId.toString() !== req.user.user.id) {
//       return res.status(401).json({ msg: "User not authorized" })
//     }

//     await Deal.deleteOne({ _id: req.params.id })

//     res.json({ msg: "Deal removed" })
//   } catch (err) {
//     console.error(err.message)
//     res.status(500).send("Server error")
//   }
// })

// // Start server
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const app = express()
const PORT = 5000
const SECRET_KEY = "Aniket@2004"

// Middleware
app.use(cors())
app.use(express.json())

// MongoDB Connection
mongoose
  .connect("mongodb://localhost:27017/savrgo", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Connection Error:", err))

// User Schema
const UserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    enum: ["business", "customer"],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// Deal Schema
const DealSchema = new mongoose.Schema({
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  businessName: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ["fashion", "restaurant", "electronics", "movies", "travel", "other"],
    required: true,
  },
  discount: {
    type: String,
    required: true,
  },
  originalPrice: {
    type: Number,
    required: true,
  },
  discountedPrice: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  validUntil: {
    type: Date,
    required: true,
  },
  promoCode: {
    type: String,
  },
  image: {
    type: String,
    default: "https://www.google.com/imgres?q=special%20offer%20image&imgurl=https%3A%2F%2Fpng.pngtree.com%2Fpng-clipart%2F20230529%2Foriginal%2Fpngtree-special-offer-tag-shape-free-vector-png-image_9173639.png&imgrefurl=https%3A%2F%2Fpngtree.com%2Ffree-png-vectors%2Foffer&docid=suxJzWtuGneLOM&tbnid=eSUC67mCxhEFXM&vet=12ahUKEwjN9b6K-PCMAxWEe_UHHagiEPIQM3oECBgQAA..i&w=1200&h=1200&hcb=2&ved=2ahUKEwjN9b6K-PCMAxWEe_UHHagiEPIQM3oECBgQAA",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  savedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
})

const User = mongoose.model("User", UserSchema)
const Deal = mongoose.model("Deal", DealSchema)

// Authentication Middleware
const auth = (req, res, next) => {
  const token = req.header("x-auth-token")
  if (!token) return res.status(401).json({ msg: "No token, authorization denied" })

  try {
    const decoded = jwt.verify(token, SECRET_KEY)
    req.user = decoded
    next()
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" })
  }
}

// Routes
// Register User
app.post("/api/users/register", async (req, res) => {
  const { fullName, email, password, userType } = req.body

  try {
    let user = await User.findOne({ email })
    if (user) {
      return res.status(400).json({ msg: "User already exists" })
    }

    user = new User({
      fullName,
      email,
      password,
      userType,
    })

    // Hash password
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(password, salt)

    await user.save()

    // Create JWT
    const payload = {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        userType: user.userType,
      },
    }

    jwt.sign(payload, SECRET_KEY, { expiresIn: "5d" }, (err, token) => {
      if (err) throw err
      res.json({ token, user: payload.user })
    })
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

// Login User
app.post("/api/users/login", async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ msg: "Invalid Credentials" })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid Credentials" })
    }

    // Create JWT
    const payload = {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        userType: user.userType,
      },
    }

    jwt.sign(payload, SECRET_KEY, { expiresIn: "5d" }, (err, token) => {
      if (err) throw err
      res.json({ token, user: payload.user })
    })
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

// Create Deal
app.post("/api/deals", auth, async (req, res) => {
  const {
    title,
    description,
    category,
    discount,
    originalPrice,
    discountedPrice,
    location,
    validUntil,
    promoCode,
    image,
  } = req.body

  try {
    const user = await User.findById(req.user.user.id)

    if (user.userType !== "business") {
      return res.status(403).json({ msg: "Only businesses can create deals" })
    }

    const newDeal = new Deal({
      businessId: req.user.user.id,
      businessName: user.fullName,
      title,
      description,
      category,
      discount,
      originalPrice,
      discountedPrice,
      location,
      validUntil,
      promoCode,
      image: image || "https://www.google.com/imgres?q=special%20offer%20image&imgurl=https%3A%2F%2Fpng.pngtree.com%2Fpng-clipart%2F20230529%2Foriginal%2Fpngtree-special-offer-tag-shape-free-vector-png-image_9173639.png&imgrefurl=https%3A%2F%2Fpngtree.com%2Ffree-png-vectors%2Foffer&docid=suxJzWtuGneLOM&tbnid=eSUC67mCxhEFXM&vet=12ahUKEwjN9b6K-PCMAxWEe_UHHagiEPIQM3oECBgQAA..i&w=1200&h=1200&hcb=2&ved=2ahUKEwjN9b6K-PCMAxWEe_UHHagiEPIQM3oECBgQAA",
    })

    const deal = await newDeal.save()
    res.json(deal)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

// Get All Deals
app.get("/api/deals", async (req, res) => {
  try {
    const { category } = req.query
    const query = {}

    if (category && category !== "all") {
      query.category = category
    }

    const deals = await Deal.find(query).where("validUntil").gt(new Date()).sort({ createdAt: -1 })

    res.json(deals)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

// Get Business Deals
app.get("/api/business/deals", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.user.id)

    if (user.userType !== "business") {
      return res.status(403).json({ msg: "Not authorized" })
    }

    const deals = await Deal.find({ businessId: req.user.user.id }).sort({ createdAt: -1 })

    res.json(deals)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

// Get Deal by ID
app.get("/api/deals/:id", async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.id)

    if (!deal) {
      return res.status(404).json({ msg: "Deal not found" })
    }

    res.json(deal)
  } catch (err) {
    console.error(err.message)
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Deal not found" })
    }
    res.status(500).send("Server error")
  }
})

// Save Deal
app.post("/api/deals/:id/save", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.user.id)

    if (user.userType !== "customer") {
      return res.status(403).json({ msg: "Only customers can save deals" })
    }

    const deal = await Deal.findById(req.params.id)

    if (!deal) {
      return res.status(404).json({ msg: "Deal not found" })
    }

    // Check if already saved
    if (deal.savedBy.includes(req.user.user.id)) {
      return res.status(400).json({ msg: "Deal already saved" })
    }

    deal.savedBy.push(req.user.user.id)
    await deal.save()

    res.json({ msg: "Deal saved successfully" })
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

// Unsave Deal
app.delete("/api/deals/:id/save", auth, async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.id)

    if (!deal) {
      return res.status(404).json({ msg: "Deal not found" })
    }

    // Remove user from savedBy array
    const removeIndex = deal.savedBy.indexOf(req.user.user.id)

    if (removeIndex === -1) {
      return res.status(400).json({ msg: "Deal not saved by user" })
    }

    deal.savedBy.splice(removeIndex, 1)
    await deal.save()

    res.json({ msg: "Deal unsaved successfully" })
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

// Get Saved Deals
app.get("/api/deals/saved/me", auth, async (req, res) => {
  try {
    const deals = await Deal.find({ savedBy: req.user.user.id })
      .where("validUntil")
      .gt(new Date())
      .sort({ createdAt: -1 })

    res.json(deals)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

// Delete Deal
app.delete("/api/deals/:id", auth, async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.id)

    if (!deal) {
      return res.status(404).json({ msg: "Deal not found" })
    }

    // Check if user owns the deal
    if (deal.businessId.toString() !== req.user.user.id) {
      return res.status(401).json({ msg: "User not authorized" })
    }

    await Deal.deleteOne({ _id: req.params.id })

    res.json({ msg: "Deal removed" })
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

