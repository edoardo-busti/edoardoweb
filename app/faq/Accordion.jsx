import AccordionItem from "./AccordionItem";
import accordionData from "./accordion-data.json";
import "./Accordion.scss";

export default function Accordion() {
  return (
    <div className="accordion__content mb--100">
      {accordionData.map((item) => (
        <AccordionItem
          key={item.id}
          question={item.question}
          answers={item.answers}
        />
      ))}
    </div>
  );
}
