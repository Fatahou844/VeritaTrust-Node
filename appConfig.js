module.exports = {
  facebook: {
    clientID: "2961259804180612",
    clientSecret: "3d67a3baaaab52ba7f02dbc95b3c586a",
    callbackURL: "https://api.veritatrust.com/api/auth/facebook/callback",
  },
  urlClients: {
    urlSuccess: "https://api.veritatrust.com/account",
    urlSuccessForFB: "https://api.veritatrust.com/add-review-create-for-beta",
    urlRedirect: "https://api.veritatrust.com/account",
    urlSuccessAssociated: "https://api.veritatrust.com/account/settings/",
    urlSuccessOrgReviewFormRedirect: "/",

  },
  google: {
    clientID:
      "1036726798056-idduh86bhvsjo0mrhuuhoj8l87u4alvi.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "https://api.veritatrust.com/api/auth/google/callback",
    callBackUrlReviewForm: "https://api.veritatrust.com/api/auth/google/reviewform/callback",
  },
};
