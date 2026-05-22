import { z } from "zod";

import { loginSchema } from "./schemas";

export type LoginFormInputs = z.infer<typeof loginSchema>;
