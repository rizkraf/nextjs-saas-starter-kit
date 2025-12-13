import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { organization } from "better-auth/plugins";
import prisma from "./prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      prompt: "select_account",
    },
  },
  plugins: [
    organization({
      allowUserToCreateOrganization: true,
      organizationLimit: 5,
      creatorRole: "owner",
      membershipLimit: 100,
      async sendInvitationEmail(data) {
        // TODO: Implement email service (e.g., Resend, SendGrid)
        // For development, log the invitation link
        const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL}/accept-invitation/${data.id}`;
        console.log(`
          📧 Organization Invitation
          To: ${data.email}
          From: ${data.inviter.user.name} (${data.inviter.user.email})
          Organization: ${data.organization.name}
          Link: ${inviteLink}
        `);
      },
    }),
  ],
});
