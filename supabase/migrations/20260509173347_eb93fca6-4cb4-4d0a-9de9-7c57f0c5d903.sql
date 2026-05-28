
-- Fix search_path on functions
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

-- Revoke public execute on SECURITY DEFINER helpers
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

-- Replace permissive insert policy with input validation
DROP POLICY IF EXISTS "Anyone can submit reports" ON public.withdrawal_reports;
CREATE POLICY "Anyone can submit reports"
  ON public.withdrawal_reports
  FOR INSERT
  WITH CHECK (
    char_length(casino_name) BETWEEN 1 AND 80
    AND char_length(payment_method) BETWEEN 1 AND 60
    AND char_length(amount_range) BETWEEN 1 AND 40
    AND (player_location IS NULL OR char_length(player_location) <= 60)
    AND withdrawal_minutes > 0 AND withdrawal_minutes < 100000
    AND approved = true
  );
