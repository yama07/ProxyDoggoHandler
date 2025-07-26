import { describe, test } from "@jest/globals";
import { render, screen } from "@testing-library/react";

import ProfilieFormDialog from "~/components/ProfileFormDialog";

describe("ProfilieFormDialogコンポーネント", () => {
  test("要素が存在している", () => {
    render(<ProfilieFormDialog onConfirm={(_newProfile) => () => {}} onDismiss={() => {}} />);

    screen.getByText("Icon");
    screen.getByText("Name");
  });
});
