import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MUN_FAQ_Data } from "@/data/MUN_FAQ";
import CardWrapper from "./CardWrapper";

const MUN_FAQ: React.FC = () => {
  return (
    <CardWrapper title="Frequently Asked Questions">
      <div className="mx-auto w-full max-w-4xl">
        <Accordion type="single" collapsible className="w-full">
          {MUN_FAQ_Data.map((item, index) => (
            <AccordionItem
              key={item.id}
              value={`item-${item.id}`}
              className="
                border-b
                border-[#3D5A80]/20
                last:border-b-0
                dark:border-[#98C1D9]/15
              "
            >
              <AccordionTrigger
                className="
                  group
                  py-5
                  text-left
                  no-underline
                  hover:no-underline
                  [&>svg]:text-[#3D5A80]
                  dark:[&>svg]:text-[#98C1D9]
                "
              >
                <div className="flex items-center gap-4 pr-4">
                  <span
                    className="
                      flex
                      h-9
                      w-9
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-[#3D5A80]/40
                      bg-[#98C1D9]/15
                      text-xs
                      font-semibold
                      text-[#3D5A80]
                      transition-all
                      duration-300
                      group-hover:border-[#EE6C4D]
                      group-hover:bg-[#EE6C4D]/10
                      group-hover:text-[#EE6C4D]
                      dark:border-[#98C1D9]/25
                      dark:bg-[#98C1D9]/5
                      dark:text-[#98C1D9]
                    "
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span
                    className="
                      text-sm
                      font-medium
                      leading-6
                      text-[#293241]
                      transition-colors
                      duration-300              
                      dark:text-[#E0FBFC]
                      sm:text-base
                    "
                  >
                    {item.question}
                  </span>
                </div>
              </AccordionTrigger>

              <AccordionContent
                className="
                  pb-6
                  pl-12
                  pr-6
                  text-sm
                  leading-7
                  text-[#293241]/70
                  dark:text-[#E0FBFC]/70
                  sm:text-[15px]
                "
              >
                <div
                  className="
                    border-l-2
                    border-[#98C1D9]
                    pl-5
                    dark:border-[#3D5A80]
                  "
                >
                  {item.answer}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </CardWrapper>
  );
};

export default MUN_FAQ;