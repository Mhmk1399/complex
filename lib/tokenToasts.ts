import toast from "react-hot-toast";

export const tokenToasts = {
  insufficientTokens: () => {
    toast.error("توکن های شما تمام شده است. از داشبورد خرید کنید", {
      duration: 8000,
      position: "top-center",
      icon: "🪙",
      style: {
        background: '#FEF2F2',
        border: '1px solid #FECACA',
        color: '#DC2626',
        fontFamily: 'inherit',
        direction: 'rtl',
      },
    });
  },

  lowTokens: (remaining: number) => {
    toast.warning(`توکن های شما رو به اتمام است (${remaining} باقیمانده)`, {
      duration: 6000,
      position: "top-center",
      icon: "⚠️",
      style: {
        background: '#FFFBEB',
        border: '1px solid #FED7AA',
        color: '#D97706',
        fontFamily: 'inherit',
        direction: 'rtl',
      },
    });
  },

  tokenConsumed: (remaining: number) => {
    toast.success(`توکن مصرف شد. ${remaining} توکن باقیمانده`, {
      duration: 3000,
      position: "top-center",
      icon: "✅",
      style: {
        background: '#F0FDF4',
        border: '1px solid #BBF7D0',
        color: '#16A34A',
        fontFamily: 'inherit',
        direction: 'rtl',
      },
    });
  },

  tokenError: () => {
    toast.error("خطا در بررسی توکن ها. دوباره تلاش کنید", {
      duration: 5000,
      position: "top-center",
      icon: "❌",
      style: {
        fontFamily: 'inherit',
        direction: 'rtl',
      },
    });
  },
};