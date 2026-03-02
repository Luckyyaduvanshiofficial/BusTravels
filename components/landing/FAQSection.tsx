import { FAQ_DATA } from '@/lib/data/landing'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

export function FAQSection() {
  return (
    <section id="faq" className="py-20 sm:py-24 bg-white border-t border-gray-100" aria-labelledby="faq-heading">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1.5 bg-orange-50 text-saffron text-xs font-bold uppercase tracking-widest rounded-full mb-4">
            FAQs
          </span>
          <h2 id="faq-heading" className="font-heading text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Everything you need to know before booking your next bus with BusYatra.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full rounded-2xl border border-gray-200 bg-gray-50 p-3 sm:p-4">
          {FAQ_DATA.map((faq, index) => (
            <AccordionItem key={faq.question} value={`faq-${index}`} className="rounded-xl px-3 border-b border-gray-200 last:border-b-0">
              <AccordionTrigger className="text-left text-base font-semibold text-gray-900 hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron/50 rounded-md">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
