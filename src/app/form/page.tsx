import FormSection from "@/components/Form/formSection";


const Form = () => {
  return (
    <section className="flex place-self-center my--container">
      <div className="flex w-full h-full bg-[var(--box-grey-color)] shadow-xl rounded-3xl p-10 lg:p-16 xl:p-20">
        <FormSection />
      </div>
    </section>
  )
}

export default Form;
