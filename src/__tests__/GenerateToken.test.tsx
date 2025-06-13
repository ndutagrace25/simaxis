import { render } from "@testing-library/react";
import { GenerateToken } from "../pages/tokens";

test("renders the app", () => {
  render(<GenerateToken />);
});
