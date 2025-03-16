/**
 * Filters utility classes based on the theme
 * @param {string} utilityClasses - Space-separated string of utility classes
 * @param {string} theme - Either "light" or "dark"
 * @returns {string} - Filtered utility classes based on theme
 */
export function filterUtilityClasses(
  utilityClasses: string,
  theme: string | undefined
): string {
  // Split the utility classes string into an array
  const classes = utilityClasses.split(" ");

  // Initialize result array
  const filteredClasses = [];

  // Map to store dark variants by their property
  const darkVariantMap = new Map();

  // First pass: collect all dark variants
  for (let i = 0; i < classes.length; i++) {
    const currentClass = classes[i];
    if (currentClass.startsWith("dark:")) {
      const baseClass = currentClass.substring(5);
      const property = baseClass.split("-")[0];

      // Store the dark variant with its property
      if (!darkVariantMap.has(property)) {
        darkVariantMap.set(property, []);
      }
      darkVariantMap.get(property).push(baseClass);
    }
  }

  // Second pass: filter classes based on theme
  for (let i = 0; i < classes.length; i++) {
    const currentClass = classes[i];

    // Handle dark variant classes
    if (currentClass.startsWith("dark:")) {
      if (theme === "dark") {
        // Add the class without "dark:" prefix
        filteredClasses.push(currentClass.substring(5));
      }
      // Skip adding dark variants in light mode
    }
    // Handle regular classes
    else {
      const property = currentClass.split("-")[0];

      // Check if this property has dark variants
      if (theme === "dark" && darkVariantMap.has(property)) {
        // Skip this class if it affects the same property as a dark variant
        // For example, skip bg-white if there's a dark:bg-[#151718]
        const shouldSkip = darkVariantMap
          .get(property)
          .some((darkClass: string) => {
            // If both classes affect the same property (e.g., both are bg-*)
            return darkClass.split("-")[0] === property;
          });

        if (shouldSkip) {
          continue;
        }
      }

      // Add the class if it wasn't skipped
      filteredClasses.push(currentClass);
    }
  }

  // Join the filtered classes back into a string
  return filteredClasses.join(" ");
}
