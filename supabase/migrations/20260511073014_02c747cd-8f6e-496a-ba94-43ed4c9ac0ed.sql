
-- 1) Complaints: revoke email column from public roles (RLS still applies, but column grants block selecting email)
REVOKE SELECT (email) ON public.complaints FROM anon, authenticated;

-- 2) Withdrawal reports: require approved=false on insert so admins must approve
DROP POLICY IF EXISTS "Anyone can submit reports" ON public.withdrawal_reports;
CREATE POLICY "Anyone can submit reports"
ON public.withdrawal_reports
FOR INSERT
TO public
WITH CHECK (
  char_length(casino_name) BETWEEN 1 AND 80
  AND char_length(payment_method) BETWEEN 1 AND 60
  AND char_length(amount_range) BETWEEN 1 AND 40
  AND (player_location IS NULL OR char_length(player_location) <= 60)
  AND withdrawal_minutes > 0
  AND withdrawal_minutes < 100000
  AND approved = false
);

-- 3) user_roles: restrict INSERT/UPDATE/DELETE to admins only
CREATE POLICY "Admins insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins update roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins delete roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));
