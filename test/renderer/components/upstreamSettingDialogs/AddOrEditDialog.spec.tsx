import { describe, test } from "@jest/globals";
import { render, screen } from "@testing-library/react";

import AddOrEditDialog from "~/components/profileSettingDialogs/AddOrEditDialog";

describe("AddOrEditDialogコンポーネント", () => {
  test("要素が存在している", () => {
    render(<AddOrEditDialog onConfirm={(newProfile) => () => {}} onDismiss={() => {}} />);

    screen.getByText("Icon");
    screen.getByText("Name");
    screen.getByText("Host");
    screen.getByText("Port number");
    screen.getByText("Authentication");
  });
});
