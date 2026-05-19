/** Global regex patterns. */
export const RegexUtils = {
  email:
    /^(?![.-])([\w.-]+)(?<![.-])@(?![.-])([\w-]+)(?<![.-])((\.([a-zA-Z]){2,3})+)$/,

  colorHexadecimal: /^#[0-9A-Fa-f]{6}$/i,

  slug: /^(?!-)(?!.*--)[a-z0-9-]{3,30}(?<!-)$/,
};
