const auth = firebase.auth();

function handleResetPassword(actionCode) {
  // Localize the UI to the selected language as determined by the lang
  // parameter.

  // Verify the password reset code is valid.
  auth.verifyPasswordResetCode(actionCode).then((email) => {
    const accountEmail = email;

    const newPassword = "12345678";

    // Save the new password.
    auth.confirmPasswordReset(actionCode, newPassword).then((resp) => {
      // Password reset has been confirmed and new password updated.
      
      console.log("password bas been reset with succes");
      
    }).catch((error) => {
      // Error occurred during confirmation. The code might have expired or the
      // password is too weak.
    });
  }).catch((error) => {
    // Invalid or expired action code. Ask user to try to reset the password
    // again.
  });
}