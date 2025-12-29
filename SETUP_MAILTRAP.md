# Setting up Mailtrap for OnyeAkuko

To enable email digests, you need to configure Mailtrap. Follow these steps:

1. **Create an Account**: Go to [mailtrap.io](https://mailtrap.io/) and sign up.
2. **Go to Sending Domains**: In the left sidebar, click on "Sending Domains".
3. **Add a Domain**: Add your domain (e.g., `onyeakuko.vercel.app`). You'll need to verify it with DNS records.
    - *Note: If you just want to test locally, you can use the "Email Testing" (Inboxes) feature, but the current code is written for the "Email Sending" (API) feature.*
4. **Get API Credentials**:
    - Go to **API and SMTP**.
    - Select **API Tokens**.
    - Generate a token and copy it.
5. **Find your API Details**:
    - The `MAILTRAP_API_KEY` is the token you just generated.
    - The code currently uses `MAILTRAP_INBOX_ID` in a URL that looks like `https://send.api.mailtrap.io/api/send/{INBOX_ID}`. Note: For the **Sending API**, you usually use a specific endpoint or domain-based auth.

### Updated `.env.local`
Add these to your `.env.local`:
```bash
MAILTRAP_API_KEY=your_token_here
MAILTRAP_ACCOUNT_ID=your_account_id
MAILTRAP_INBOX_ID=your_inbox_or_domain_id
```

> [!TIP]
> I will update the code to be more flexible with Mailtrap's official SDK or a simpler fetch approach once we confirm your credentials.
