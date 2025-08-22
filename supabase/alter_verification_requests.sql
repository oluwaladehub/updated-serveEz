
ALTER TABLE public.verification_requests 
ADD COLUMN IF NOT EXISTS timeline TEXT CHECK (timeline IN ('2_weeks', '4_weeks', '2_months', 'project_duration'));

ALTER TABLE public.verification_requests 
ADD COLUMN IF NOT EXISTS estimated_cost DECIMAL(15,2);

ALTER TABLE public.verification_requests 
ADD COLUMN IF NOT EXISTS currency TEXT CHECK (currency IN ('NGN', 'USD'));

ALTER TABLE public.verification_requests 
ADD COLUMN IF NOT EXISTS contact_name TEXT,
ADD COLUMN IF NOT EXISTS contact_phone TEXT,
ADD COLUMN IF NOT EXISTS contact_email TEXT;

ALTER TABLE public.verification_requests 
ADD COLUMN IF NOT EXISTS site_access_instructions TEXT;

ALTER TABLE public.verification_requests 
ADD COLUMN IF NOT EXISTS preferred_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS preferred_time_range TEXT;

CREATE INDEX IF NOT EXISTS idx_verification_requests_timeline ON public.verification_requests(timeline);

COMMENT ON COLUMN public.verification_requests.timeline IS 'Duration of the verification process: 2_weeks, 4_weeks, 2_months, or project_duration';
COMMENT ON COLUMN public.verification_requests.estimated_cost IS 'Estimated cost of the verification service';
COMMENT ON COLUMN public.verification_requests.currency IS 'Currency for the estimated cost: NGN or USD';
COMMENT ON COLUMN public.verification_requests.contact_name IS 'Name of the primary contact person for the verification';
COMMENT ON COLUMN public.verification_requests.contact_phone IS 'Phone number of the primary contact person';
COMMENT ON COLUMN public.verification_requests.contact_email IS 'Email address of the primary contact person';
COMMENT ON COLUMN public.verification_requests.site_access_instructions IS 'Special instructions for accessing the project site';
COMMENT ON COLUMN public.verification_requests.preferred_date IS 'Preferred date for the verification visit';
COMMENT ON COLUMN public.verification_requests.preferred_time_range IS 'Preferred time range for the verification visit'; 