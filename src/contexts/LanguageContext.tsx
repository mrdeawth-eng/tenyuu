import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Lang = "th" | "en";

const translations = {
  th: {
    // Bottom nav
    home: "หน้าแรก",
    fridge: "ตู้เย็น",
    profile: "โปรไฟล์",
    // Recipes page
    searchPlaceholder: "ค้นหาเมนู",
    expiringTitle: "วัตถุดิบใกล้หมดอายุ",
    noExpiring: "ไม่มีวัตถุดิบใกล้หมดอายุ",
    recommended: "เมนูแนะนำ (Recommend)",
    historyTitle: "ประวัติการค้นหา (History)",
    // Search
    category: "หมวดหมู่",
    searchCategory: "ค้นหาหมวดหมู่",
    searching: "กำลังค้นหา...",
    noResults: "ไม่พบเมนู",
    // Fridge
    fridgeTitle: "รายการในตู้เย็น",
    loading: "กำลังโหลด...",
    noIngredients: "ยังไม่มีวัตถุดิบในตู้เย็น",
    selectIngredients: "เลือกวัตถุดิบ",
    addIngredient: "เพิ่มวัตถุดิบ",
    deleteSelected: "ลบวัตถุดิบที่เลือก",
    cancel: "ยกเลิก",
    // Fridge Add/Edit
    addIngredientTitle: "เพิ่มวัตถุดิบ",
    ingredientName: "กรอกชื่อวัตถุดิบ",
    expirationDate: "กรอกวันหมดอายุ",
    quantity: "ปริมาณ",
    selectUnit: "เลือกหน่วยที่ต้องการ",
    notes: "บันทึกความจำ",
    confirmAdd: "ยืนยันรายการ",
    editIngredient: "แก้ไขวัตถุดิบ",
    confirmEdit: "ยืนยันการแก้ไขวัตถุดิบ",
    noNotes: "ไม่มีบันทึก",
    notSpecified: "ไม่ระบุ",
    // Profile
    history: "ประวัติ",
    noHistory: "คุณยังไม่ได้ประวัติการทำอาหาร",
    favorite: "รายการโปรด",
    setting: "ตั้งค่า",
    report: "รายงาน",
    logout: "ออกจากระบบ",
    // Profile Favorite
    noFavorites: "ไม่มีเมนูโปรด",
    // Profile Settings
    account: "บัญชี",
    darkMode: "โหมดมืด",
    language: "ภาษา",
    // Profile Account
    email: "อีเมล",
    password: "รหัสผ่าน",
    noEmail: "ไม่มีอีเมล",
    // Report
    reportTitle: "รายงาน",
    reportPlaceholder: "แอปนี้ง่ายมากเลยค่ะ",
    reportSuccess: "รายงานเรียบร้อย",
    // Recipe Detail
    recipeNotFound: "ไม่พบเมนูนี้",
    ingredients: "วัตถุดิบ",
    instructions: "วิธีทำ",
    clipVideo: "Clip Video",
    noVideo: "ยังไม่มีคลิปวิดีโอ",
    reviews: "รีวิว",
    noReviews: "ยังไม่มีรีวิว",
    similarRecipes: "เมนูใกล้เคียง",
    addToList: "เพิ่มในรายการเมนู",
    addedToList: "เพิ่มในรายการแล้ว",
    removedFromList: "ลบออกจากรายการ",
    cookingDone: "ทำอาหารเสร็จแล้ว!",
    thankReview: "ขอบคุณสำหรับรีวิวของคุณ",
    done: "เสร็จสิ้น",
    reviewTitle: "รีวิวเมนูนี้",
    rateLabel: "ให้คะแนน",
    commentLabel: "ความคิดเห็น (ไม่บังคับ)",
    commentPlaceholder: "เขียนความคิดเห็นของคุณ...",
    submitReview: "ส่งรีวิว",
    submitting: "กำลังบันทึก...",
    selectRating: "กรุณาเลือกคะแนน",
    reviewError: "ไม่สามารถบันทึกรีวิวได้",
    startCooking: "เริ่มทำอาหาร",
    // Login
    discoverRecipes: "Discover & share recipes",
    loginBtn: "เข้าสู่ระบบ",
    registerBtn: "สมัครสมาชิก",
    backToLogin: "กลับไปเข้าสู่ระบบ",
    forgetPassword: "ลืมรหัสผ่าน ?",
    or: "-หรือ-",
    // Forgot password
    forgotTitle: "Forgot Your\nPassword\nAnd Continue",
    submitNow: "Submit Now",
    verifyTitle: "Verify",
    verifySubtitle: "Enter the 4-digit verification code",
    continueBtn: "Continue",
    resetPasswordTitle: "Reset Password",
    newPassword: "Enter your new password",
    confirmPassword: "Confirm your password",
    // Units
    piece: "ชิ้น",
    gram: "กรัม (g)",
    kilogram: "กิโลกรัม (kg)",
    milliliter: "มิลลิลิตร (ml)",
    liter: "ลิตร (L)",
    milligram: "มิลลิกรัม (mg)",
    confirmSelection: "ยืนยัน",
    confirmLogoutTitle: "ยืนยันการออกจากระบบ",
    confirmLogoutMessage: "คุณแน่ใจหรือไม่ว่าต้องการออกจากระบบ?",
    confirm: "ยืนยัน",
    matchingRecipes: "เมนูที่ตรงกับวัตถุดิบ",
    noMatchingRecipes: "ไม่พบเมนูที่ตรงกับวัตถุดิบที่เลือก",
  },
  en: {
    home: "Home",
    fridge: "Fridge",
    profile: "Profile",
    searchPlaceholder: "Search menu",
    expiringTitle: "Expiring Ingredients",
    noExpiring: "No expiring ingredients",
    recommended: "Recommended",
    historyTitle: "Search History",
    category: "Category",
    searchCategory: "Search category",
    searching: "Searching...",
    noResults: "No results found",
    fridgeTitle: "Fridge Items",
    loading: "Loading...",
    noIngredients: "No ingredients in fridge",
    selectIngredients: "Select Ingredients",
    addIngredient: "Add Ingredient",
    deleteSelected: "Delete Selected",
    cancel: "Cancel",
    addIngredientTitle: "Add Ingredient",
    ingredientName: "Ingredient name",
    expirationDate: "Expiration date",
    quantity: "Quantity",
    selectUnit: "Select unit",
    notes: "Notes",
    confirmAdd: "Confirm",
    editIngredient: "Edit Ingredient",
    confirmEdit: "Confirm Edit",
    noNotes: "No notes",
    notSpecified: "Not specified",
    history: "History",
    noHistory: "No cooking history yet",
    favorite: "Favorite",
    setting: "Setting",
    report: "Report",
    logout: "Log out",
    noFavorites: "No favorite recipes",
    account: "Account",
    darkMode: "Dark mode",
    language: "Language",
    email: "Email",
    password: "Password",
    noEmail: "No email",
    reportTitle: "Report",
    reportPlaceholder: "This app is very easy to use!",
    reportSuccess: "Report submitted successfully",
    recipeNotFound: "Recipe not found",
    ingredients: "Ingredients",
    instructions: "Instructions",
    clipVideo: "Clip Video",
    noVideo: "No video available",
    reviews: "Reviews",
    noReviews: "No reviews yet",
    similarRecipes: "Similar Recipes",
    addToList: "Add to list",
    addedToList: "Added to list",
    removedFromList: "Removed from list",
    cookingDone: "Cooking done!",
    thankReview: "Thank you for your review",
    done: "Done",
    reviewTitle: "Review this recipe",
    rateLabel: "Rate",
    commentLabel: "Comment (optional)",
    commentPlaceholder: "Write your comment...",
    submitReview: "Submit Review",
    submitting: "Submitting...",
    selectRating: "Please select a rating",
    reviewError: "Could not save review",
    startCooking: "Start Cooking",
    discoverRecipes: "Discover & share recipes",
    loginBtn: "Login",
    registerBtn: "Register",
    backToLogin: "Back to Login",
    forgetPassword: "Forget Password ?",
    or: "-or-",
    forgotTitle: "Forgot Your\nPassword\nAnd Continue",
    submitNow: "Submit Now",
    verifyTitle: "Verify",
    verifySubtitle: "Enter the 4-digit verification code",
    continueBtn: "Continue",
    resetPasswordTitle: "Reset Password",
    newPassword: "Enter your new password",
    confirmPassword: "Confirm your password",
    piece: "Piece",
    gram: "Gram (g)",
    kilogram: "Kilogram (kg)",
    milliliter: "Milliliter (ml)",
    liter: "Liter (L)",
    milligram: "Milligram (mg)",
    confirmSelection: "Confirm",
    confirmLogoutTitle: "Confirm Logout",
    confirmLogoutMessage: "Are you sure you want to log out?",
    confirm: "Confirm",
    matchingRecipes: "Recipes matching your ingredients",
    noMatchingRecipes: "No recipes match the selected ingredients",
  },
} as const;

type Translations = Record<keyof typeof translations.th, string>;

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "th",
  setLang: () => {},
  t: translations.th,
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Lang>(() => {
    return (localStorage.getItem("app_language") as Lang) || "th";
  });

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("app_language", l);
  };

  const t = translations[lang];

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
