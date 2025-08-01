import * as z from "zod";

export const dogIconIds = [
  "001-dog",
  "002-dog",
  "003-dog",
  "004-dog",
  "005-dog",
  "006-dog",
  "007-dog",
  "008-dog",
  "009-dog",
  "010-dog",
  "011-dog",
  "012-dog",
  "013-dog",
  "014-dog",
  "015-dog",
  "016-dog",
  "017-dog",
  "018-dog",
  "019-dog",
  "020-dog",
  "021-dog",
  "022-dog",
  "023-dog",
  "024-dog",
  "025-dog",
  "026-dog",
  "027-dog",
  "028-dog",
  "029-dog",
  "030-dog",
  "031-dog",
  "032-dog",
  "033-dog",
  "034-dog",
  "035-dog",
  "036-dog",
  "037-dog",
  "038-dog",
  "039-dog",
  "040-dog",
  "041-dog",
  "042-dog",
  "043-dog",
  "044-dog",
  "045-dog",
  "046-dog",
  "047-dog",
  "048-dog",
  "049-dog",
  "050-dog",
] as const;

export const dogIconIdSchema = z.enum(dogIconIds);

export type DogIconId = z.infer<typeof dogIconIdSchema>;
