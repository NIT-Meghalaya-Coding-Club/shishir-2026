import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { MUN_FAQ_Data } from "@/data/MUN_FAQ";
import CardWrapper from "./CardWrapper";

const MUN_FAQ:React.FC = () => {
    return (
      <CardWrapper title="Frequently Asked Questions">
        <Accordion type="single" collapsible className="w-full">
          {MUN_FAQ_Data.map((item)=>(
            <AccordionItem key={item.id} value={`item-${item.id}`}>
              <AccordionTrigger className="text-md font-circular-web">{item.question}</AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardWrapper>
    );
}

export default MUN_FAQ;