/**
 * Form Page Component
 * 
 * This page renders the customer complaint form (route: "/form").
 * It provides a centered, styled container for the form component.
 * 
 * Layout structure:
 * - Full-width section with gradient background
 * - Centered container with responsive width
 * - White card container with shadow and rounded corners
 * - FormSection component handles all form logic
 * 
 * Styling:
 * - Gradient background from pale green to background pale green
 * - Responsive padding and spacing
 * - Shadow effects for visual depth
 */
import FormSection from "@/components/Form/formSection";

const Form = () => {
  return (
    <section className="bg-linear-to-b from-[var(--pale-green-color)] to-[var(--background-pale-green-color)]">
      {/* Page header */}
      <div className="text-[var(--black-color)] text--header mb-10">
        Customer Complaint Form
      </div>
      
      {/* Main form container */}
      <div className="flex place-self-center my--container">
        <div className="flex flex-col items-center space-y-3 w-full h-full bg-[white] shadow-xl rounded-3xl p-10 lg:p-16 xl:p-20">
          {/* Form component with all form logic */}
          <FormSection />
        </div>
      </div>
    </section>
  )
}

export default Form;
