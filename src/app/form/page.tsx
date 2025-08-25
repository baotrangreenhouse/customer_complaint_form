import FormSection from "@/components/Form/formSection";


const Form = () => {
  return (
    <section className="bg-linear-to-b from-[var(--pale-green-color)] to-[var(--background-pale-green-color)] ">
      <div className="text-[var(--black-color)] text--header mb-10">
        Customer Complaint Form
      </div>
      <div className="flex place-self-center my--container">
        <div className="flex flex-col items-center space-y-3 w-full h-full bg-[white] shadow-xl rounded-3xl p-10 lg:p-16 xl:p-20">
          <FormSection />
        </div>
      </div>
    </section>
  )
}

export default Form;
