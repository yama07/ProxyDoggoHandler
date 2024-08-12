import { render, screen } from "@testing-library/react";

import AddOrEditDialog from "../../../../renderer/components/upstreamSettingDialogs/AddOrEditDialog";

describe("AddOrEditDialogコンポーネント", () => {
  test("要素が存在している", () => {
    render(<AddOrEditDialog onConfirm={(newUpstream) => () => {}} onDismiss={() => {}} />);

    screen.getByText("Icon");
    screen.getByText("Name");
    screen.getByText("Host");
    screen.getByText("Port number");
    screen.getByText("Authentication");
  });
});
