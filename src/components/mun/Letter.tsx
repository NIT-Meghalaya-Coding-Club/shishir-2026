import CardWrapper from "./CardWrapper";

const SACLetter: React.FC = () => {
  return (
    <CardWrapper title="Letter from SAC President">
      <div className="mx-auto max-w-4xl">

        {/* Letter header */}
        <div className="mb-8 border-b border-[#3D5A80] pb-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#98C1D9]">
                NIT Meghalaya
              </p>

              <p className="mt-1 text-sm text-[#E0FBFC]/70">
                Student Activity Center
              </p>
            </div>

            <p className="text-sm text-[#98C1D9]">
              NITMMUN 2025
            </p>
          </div>
        </div>

        {/* Salutation */}
        <div className="mb-6">
          <p className="text-[#E0FBFC]">
            Dear Participants, Esteemed Guests, and Esteemed Members of the NIT
            Meghalaya Community,
          </p>
        </div>

        {/* Letter body */}
        <div className="space-y-5 text-justify leading-7 text-[#E0FBFC]/90">

          <p className="first-letter:text-4xl first-letter:font-semibold first-letter:text-[#EE6C4D]">
            Welcome to the third edition of the National Institute of Technology
            Meghalaya Model United Nations (NITMMUN) 2025. It is my profound
            honor to address such a vibrant assembly of young diplomats, eager
            to debate, negotiate, and craft resolutions that reflect the
            complexities of our global landscape.
          </p>

          <p>
            Since our inaugural session in 2023, NITMMUN has grown from a
            nascent conference into a cornerstone event that exemplifies the
            analytical rigor and diplomatic finesse expected of future leaders.
            Our second conference in 2024 built upon this foundation, expanding
            its scope and depth, engaging delegates in more intense and diverse
            deliberations that tested their resolve and honed their skills.
          </p>

          <p>
            This year, we proudly host NITMMUN alongside{" "}
            <strong className="font-semibold text-[#EE6C4D]">
              Shishir
            </strong>
            , our cherished cultural festival. This confluence of cultural and
            intellectual festivities is designed to enhance your experience,
            providing a unique blend of artistic celebration and academic
            excellence. This synergy not only enriches our campus culture but
            also offers participants a holistic view of the vibrancy that NIT
            Meghalaya has to offer.
          </p>

          <p>
            Reflecting on our past conferences, it is heartening to see the
            remarkable impact these experiences have had on our participants.
            Delegates who once navigated the complexities of international
            policies and negotiations in our committees have gone on to excel
            in various professional fields, embodying the spirit of global
            citizenship and cooperation.
          </p>

          <p>
            Our 2023 edition set the precedent with its innovative agendas and
            inclusive debate forums. The following year, in 2024, we delved
            deeper into pressing global issues, fostering a culture of critical
            thinking and solution-oriented discussions that resonated well
            beyond our campus.
          </p>

          <p>
            As we step into our third session, amidst the echoes of
            Shishir&apos;s cultural anthems, I invite you all to embrace the
            challenge, celebrate diversity, and contribute to the dialogues
            that stimulate change. Let this platform be a testimony to your
            potential to influence the world, advocating for peace, equity, and
            sustainability.
          </p>

          <p>
            Thank you for joining us at NITMMUN 2025. Engage, deliberate, and
            enjoy your journey at this confluence of culture and diplomacy.
          </p>

        </div>

        {/* Signature */}
        <div className="mt-10 border-t border-[#3D5A80]/60 pt-6">
          <p className="text-sm text-[#98C1D9]">
            Warm regards,
          </p>

          <div className="mt-4">
            <p className="text-lg font-semibold text-[#EE6C4D]">
              Dr. Atanu Singha Roy
            </p>

            <p className="mt-1 text-sm leading-6 text-[#E0FBFC]/80">
              President, Student Activity Center
              <br />
              National Institute of Technology Meghalaya
            </p>
          </div>
        </div>

      </div>
    </CardWrapper>
  );
};

export default SACLetter;