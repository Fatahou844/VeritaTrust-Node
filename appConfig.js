module.exports = {
  facebook: {
    clientID: "2961259804180612",
    clientSecret: "3d67a3baaaab52ba7f02dbc95b3c586a",
    callbackURL: "http://localhost:4000/api/auth/facebook/callback",
  },
  urlClients: {
    urlSuccess: "http://localhost:4000/account",
    urlRedirect: "http://localhost:4000/account",
    urlSuccessAssociated: "http://localhost:4000/account/settings/",
    urlSuccessOrgReviewFormRedirect: "/",
  },
  google: {
    clientID:
      "1036726798056-idduh86bhvsjo0mrhuuhoj8l87u4alvi.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "http://localhost:4000/api/auth/google/callback",
    callBackUrlReviewForm:
      "http://localhost:4000/api/auth/google/reviewform/callback",
  },
};
