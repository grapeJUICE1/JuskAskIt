function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

export const checkValidity = (value, rules, pass = undefined) => {
  if (!rules) {
    return true;
  }

  let isValid = true;
  if (rules.isEmail) {
    isValid = validateEmail(value) && isValid;
  }
  if (rules.required) {
    isValid = value.trim() !== '' && isValid;
  }

  if (rules.minLenght) {
    isValid = value.length >= rules.minLenght && isValid;
  }

  if (rules.maxLenght) {
    isValid = value.length <= rules.maxLenght && isValid;
  }
  if (rules.passwordConfirm) {
    isValid = pass === value && isValid;
  }

  return isValid;
};
