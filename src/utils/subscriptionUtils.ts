// Subscription Utility Functions
// Handles subscription limits, feature access, and billing calculations

export interface SubscriptionLimits {
  events: number; // -1 = unlimited
  venues: number;
  participants: number;
  storage: number; // in GB, -1 = unlimited
  apiCalls: number;
  customBranding: boolean;
  prioritySupport: boolean;
  analytics: boolean;
  bulkImport: boolean;
  aiAssistant: boolean;
  whiteLabel: boolean;
  seatingPlans: boolean;
  hardticketShipping: boolean;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  monthlyPrice: number;
  ticketFee: number;
  limits: SubscriptionLimits;
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'basic',
    name: 'Basic',
    monthlyPrice: 29,
    ticketFee: 0,
    limits: {
      events: 10,
      venues: 5,
      participants: 1000,
      storage: 5,
      apiCalls: 10000,
      customBranding: false,
      prioritySupport: false,
      analytics: false,
      bulkImport: false,
      aiAssistant: false,
      whiteLabel: false,
      seatingPlans: false,
      hardticketShipping: false
    }
  },
  {
    id: 'advanced',
    name: 'Advanced',
    monthlyPrice: 99,
    ticketFee: 0.50,
    limits: {
      events: 50,
      venues: 25,
      participants: 10000,
      storage: 50,
      apiCalls: 50000,
      customBranding: true,
      prioritySupport: true,
      analytics: true,
      bulkImport: true,
      aiAssistant: false,
      whiteLabel: false,
      seatingPlans: true,
      hardticketShipping: false
    }
  },
  {
    id: 'premium',
    name: 'Premium',
    monthlyPrice: 299,
    ticketFee: 0.20,
    limits: {
      events: 200,
      venues: 100,
      participants: 100000,
      storage: 500,
      apiCalls: 200000,
      customBranding: true,
      prioritySupport: true,
      analytics: true,
      bulkImport: true,
      aiAssistant: true,
      whiteLabel: true,
      seatingPlans: true,
      hardticketShipping: true
    }
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    monthlyPrice: 599,
    ticketFee: 0.10,
    limits: {
      events: -1,
      venues: -1,
      participants: -1,
      storage: -1,
      apiCalls: -1,
      customBranding: true,
      prioritySupport: true,
      analytics: true,
      bulkImport: true,
      aiAssistant: true,
      whiteLabel: true,
      seatingPlans: true,
      hardticketShipping: true
    }
  }
];

// Check if user has access to a specific feature
export const hasFeatureAccess = (userPlan: string, feature: keyof SubscriptionLimits): boolean => {
  const plan = SUBSCRIPTION_PLANS.find(p => p.id === userPlan);
  if (!plan) return false;
  
  return plan.limits[feature] === true || plan.limits[feature] === -1;
};

// Check if user has reached a numeric limit
export const isLimitReached = (userPlan: string, limitType: keyof SubscriptionLimits, currentUsage: number): boolean => {
  const plan = SUBSCRIPTION_PLANS.find(p => p.id === userPlan);
  if (!plan) return true;
  
  const limit = plan.limits[limitType];
  if (typeof limit === 'number') {
    return limit !== -1 && currentUsage >= limit;
  }
  
  return false;
};

// Get remaining quota for a numeric limit
export const getRemainingQuota = (userPlan: string, limitType: keyof SubscriptionLimits, currentUsage: number): number => {
  const plan = SUBSCRIPTION_PLANS.find(p => p.id === userPlan);
  if (!plan) return 0;
  
  const limit = plan.limits[limitType];
  if (typeof limit === 'number') {
    if (limit === -1) return Infinity; // Unlimited
    return Math.max(0, limit - currentUsage);
  }
  
  return 0;
};

// Calculate monthly bill based on usage
export const calculateMonthlyBill = (userPlan: string, ticketsSold: number): number => {
  const plan = SUBSCRIPTION_PLANS.find(p => p.id === userPlan);
  if (!plan) return 0;
  
  return plan.monthlyPrice + (ticketsSold * plan.ticketFee);
};

// Get upgrade recommendations based on usage
export const getUpgradeRecommendations = (userPlan: string, usage: {
  events: number;
  venues: number;
  participants: number;
  storage: number;
  apiCalls: number;
}): { shouldUpgrade: boolean; reasons: string[]; recommendedPlan?: string } => {
  const currentPlan = SUBSCRIPTION_PLANS.find(p => p.id === userPlan);
  if (!currentPlan) return { shouldUpgrade: false, reasons: [] };
  
  const reasons: string[] = [];
  let recommendedPlan: string | undefined;
  
  // Check each limit
  Object.entries(usage).forEach(([key, value]) => {
    const limitKey = key as keyof SubscriptionLimits;
    const limit = currentPlan.limits[limitKey] as number;
    
    if (limit !== -1 && value >= limit * 0.8) { // 80% threshold
      reasons.push(`${key} usage is at ${Math.round((value / limit) * 100)}% of limit`);
    }
    
    if (limit !== -1 && value >= limit) {
      reasons.push(`${key} limit exceeded`);
    }
  });
  
  // Recommend next tier if limits are being reached
  if (reasons.length > 0) {
    const currentIndex = SUBSCRIPTION_PLANS.findIndex(p => p.id === userPlan);
    if (currentIndex < SUBSCRIPTION_PLANS.length - 1) {
      recommendedPlan = SUBSCRIPTION_PLANS[currentIndex + 1].id;
    }
  }
  
  return {
    shouldUpgrade: reasons.length > 0,
    reasons,
    recommendedPlan
  };
};

// Feature gate component helper
export const FeatureGate: React.FC<{
  userPlan: string;
  requiredFeature: keyof SubscriptionLimits;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ userPlan, requiredFeature, children, fallback }) => {
  const hasAccess = hasFeatureAccess(userPlan, requiredFeature);
  
  if (hasAccess) {
    return <>{children}</>;
  }
  
  return <>{fallback || null}</>;
};

// Usage warning component
export const UsageWarning: React.FC<{
  userPlan: string;
  limitType: keyof SubscriptionLimits;
  currentUsage: number;
  warningThreshold?: number;
}> = ({ userPlan, limitType, currentUsage, warningThreshold = 80 }) => {
  const plan = SUBSCRIPTION_PLANS.find(p => p.id === userPlan);
  if (!plan) return null;
  
  const limit = plan.limits[limitType] as number;
  if (limit === -1) return null; // Unlimited
  
  const percentage = (currentUsage / limit) * 100;
  
  if (percentage < warningThreshold) return null;
  
  const isOverLimit = percentage >= 100;
  
  return (
    <div className={`p-3 rounded-lg border ${
      isOverLimit 
        ? 'bg-red-50 border-red-200 text-red-800' 
        : 'bg-yellow-50 border-yellow-200 text-yellow-800'
    }`}>
      <div className="flex items-center space-x-2">
        <AlertTriangle className="w-4 h-4" />
        <span className="font-medium">
          {isOverLimit ? 'Limit überschritten' : 'Limit-Warnung'}
        </span>
      </div>
      <div className="text-sm mt-1">
        {limitType}: {currentUsage}/{limit} ({percentage.toFixed(0)}%)
      </div>
    </div>
  );
};