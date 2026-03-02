/// <reference types="next" />
/// <reference types="next/image-types/global" />

// CSS Module declarations
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.scss' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.sass' {
  const content: { [className: string]: string };
  export default content;
}

// Side-effect CSS imports (like globals.css)
declare module '*.css?inline' {
  const content: string;
  export default content;
}
