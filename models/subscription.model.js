import mongoose from "mongoose";

const subscriptionSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "SUBSCRIPTION NAME IS REQUIRED"],
      trim: true,
      minLength: 2,
      maxLength: 100,
    },
    price: {
      type: Number,
      required: [true, "SUBSCRIPTION PRICE IS REQUIRED"],
      minLength: [0, "PRICE MUST BE GREATER THAN 0"],
    },
    currency: {
      type: String,
      enum: ["USD", "EUR", "GBP"],
      default: "USD",
    },
    frequency: {
      type: String,
      enum: ["daily", "weekly", "monthly", "yearly"],
    },
    category: {
      type: String,
      enum: [
        "sports",
        "news",
        "entertainment",
        "lifestyle",
        "technology",
        "finance",
        "politics",
        "others",
      ],
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "cancelled", "expired"],
      default: "active",
    },
    paymentMethod: {
      type: String,
      required: true,
      trim: true,
    },
    startDate: {
      type: Date,
      required: true,
      validate: {
        validator: (value) => value <= new Date(), // Validate against the current date
        message: "start date must be in the past",
      },
    },
    renewalDate: {
      type: Date,
      validate: {
        validator: function (value) {
          return value > this.startDate; // Ensure renewal date is after start date
        },
        message: "renewal date must be after the start date",
      },
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    workflowRuns: [
      {
        workflowRunId: String,
        status: {
          type: String,
          enum: ["active", "completed", "failed"],
          default: "active",
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

// Calculate renewal date if not provided
subscriptionSchema.pre("save", function (next) {
  if (!this.renewalDate) {
    const renewalPeriods = {
      daily: 1,
      weekly: 7,
      monthly: 30,
      yearly: 365,
    };
    
    // Set renewal date based on frequency using native Date
    const startDate = new Date(this.startDate);
    this.renewalDate = new Date(startDate); // Clone the startDate to prevent mutation
    this.renewalDate.setDate(startDate.getDate() + renewalPeriods[this.frequency]);
  }
  
  // Check if the renewal date is in the past and update status
  if (this.renewalDate < new Date()) {
    this.status = "expired";
  }

  next();
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);
export default Subscription;
