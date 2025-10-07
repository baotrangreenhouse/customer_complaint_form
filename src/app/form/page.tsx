/**
 * Form Page Component
 * 
 * This page renders the customer complaint form (route: "/form").
 * It provides a centered, styled container for the form component.
 * 
 * Layout structure:
 * - Full-width section with cream background (Greenhouse design)
 * - Centered container with responsive width
 * - White card container with shadow and sharp corners
 * - FormSection component handles all form logic
 * 
 * Styling:
 * - Cream background matching Greenhouse brand
 * - Responsive padding and spacing
 * - Sharp corners throughout (no border-radius)
 * - Greenhouse shadow effects for visual depth
 */
import FormSection from "@/components/Form/formSection";

const Form = () => {
  return (
    <section className="pt-20 px-4 md:px-6 lg:px-8 min-h-screen bg-[var(--background-cream-color)] pb-12">
      <div className="max-w-7xl mx-auto">
        {/* Page header */}
        <div className="text-[var(--text-primary)] text--header mb-6 lg:mb-8">
          Customer Complaint Form
        </div>
        
        {/* Main form container - full width usage */}
        <div className="bg-white shadow--greenhouse p-6 md:p-8 lg:p-10">
          {/* Form component with all form logic */}
          <FormSection />
        </div>
      </div>
    </section>
  )
}

export default Form;
