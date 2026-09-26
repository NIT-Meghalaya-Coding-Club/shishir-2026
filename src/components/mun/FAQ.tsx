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
              className="border-b border-[#3D5A80]/60 last:border-b-0"
            >
              <AccordionTrigger
                className="
                  group
                  py-5
                  text-left
                  no-underline
                  hover:no-underline
                  [&>svg]:text-[#98C1D9]
                  [&>svg]:transition-transform
                  [&>svg]:duration-300
                "
              >
                <div className="flex items-center gap-4 pr-4">
                  {/* Question Number */}
                  <span
                    className="
                      flex
                      h-8
                      w-8
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-[#3D5A80]
                      text-xs
                      font-medium
                      text-[#98C1D9]
                      transition-colors
                      duration-300
                      group-hover:border-[#98C1D9]
                      group-hover:text-[#98C1D9]
                    "
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  {/* Question */}
                  <span
                    className="
                      text-sm
                      font-medium
                      leading-6
                      text-[#E0FBFC]
                      transition-colors
                      duration-300
                      group-hover:text-[#98C1D9]
                      sm:text-base
                    "
                  >
                    {item.question}
                  </span>
                </div>
              </AccordionTrigger>

              <AccordionContent className="pb-5 pl-12 pr-8 text-sm leading-7 text-[#E0FBFC]/75 sm:text-[15px]">
                <div className="border-l-2 border-[#3D5A80] pl-4">
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