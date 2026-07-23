-- Data migration, no schema change.
--
-- The app used to call JSON.stringify() before writing "input"/"output", so these
-- JSONB columns hold a JSON *string* ("[{\"headline\":...}]") instead of the array
-- or object itself. The write path no longer stringifies, so historic rows need
-- unwrapping to match.
--
-- `#>> '{}'` extracts the jsonb value as text, which strips the string quoting;
-- casting back to jsonb reparses it. The jsonb_typeof guard means only
-- double-encoded rows are touched, so this is safe to re-run and a no-op on rows
-- written by the new code.

UPDATE "Generation"
SET "input" = ("input" #>> '{}')::jsonb
WHERE jsonb_typeof("input") = 'string';

UPDATE "Generation"
SET "output" = ("output" #>> '{}')::jsonb
WHERE "output" IS NOT NULL
  AND jsonb_typeof("output") = 'string';
