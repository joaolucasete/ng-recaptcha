export interface Example {
  entry: string;
  name: string;
  path: string;
  label: string;
  title: string;
  index?: boolean;
}

export const examples: Example[] = [
  {
    entry: "demo-invisible",
    name: "invisible",
    path: "/invisible",
    label: "Invisible",
    title: "Invisible CAPTCHA API Example",
  },
];
