import React from 'react';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <img 
                  src="/stitches-logo.webp" 
                  alt="Stitches Clothing Co Logo" 
                  className="h-10 w-auto"
                />
              </Link>
            </div>
            <nav className="flex space-x-8">
              <Link
                href="/"
                className="text-gray-600 hover:text-gray-900 text-sm font-medium"
              >
                Application
              </Link>
              <Link
                href="/pricing-details"
                className="text-gray-600 hover:text-gray-900 text-sm font-medium"
              >
                Pricing Details
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Terms & Conditions
            </h1>
            <a
              href="/Terms.pdf"
              download
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download PDF
            </a>
          </div>

          <div className="prose prose-lg max-w-none">
            <div className="mb-8 p-6 bg-blue-50 rounded-lg">
              <h2 className="text-xl font-semibold text-blue-900 mb-4">Welcome to Stitches Clothing Co</h2>
              <p className="text-blue-800">
                Stitches Clothing Co LLC (SCC) offers custom, quality decoration services for contract clients. We
                pride ourselves on our customer service, quality of work, fast turnaround, and knowledge of the market
                and decoration processes. We run only newer, top of the line equipment that is regularly serviced and
                maintained to ensure our production is never down. We are known for our full color simulated process
                screen printing and our ability to print up to 14 spot colors. Our guaranteed turn around ensures that you
                never miss a deadline. Our friendly, knowledgeable staff is always available to answer your questions
                and educate you on new or unique decoration methods. Do you specialize in high volume? We run
                multiple shifts to accommodate any demand and offer tier pricing based on annual volume.
              </p>
              <p className="text-blue-800 mt-4">
                With all of our clients, big and small, we strive to create lasting relationships. As with any relationship, we
                believe that communication is key. The following Contract Client Packet was created to aid in our
                relationship as a reference of our standard practices and policies and to answer questions you might
                have.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Use This Packet</h2>
            <p className="text-gray-700 mb-6">
              Find a cozy seat, grab a cup of coffee (or glass of wine, maybe a beer?) and let's get started! There is a
              lot of information in this packet but the good news is you should only have to read it once then reference
              it as needed. The purpose of this packet is to answer any questions you might have about who we are,
              how we operate, and what we do. A lot of work goes into garment decoration and there is plenty of room
              for error and miscommunication. We try our best to stay organized so that we can send your clients
              quality garments as quickly as possible. We ask that you thoroughly read this entire packet before you
              sign the contracts at the end, as they are legally binding. We also ask that you give this packet to all of
              your reps (current and future) to ensure that they understand how we operate to avoid any confusion,
              unnecessary frustration, and/or delays in the order process.
            </p>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <p className="text-yellow-800">
                <strong>Questions?</strong> Please do not hesitate to call me directly with any questions you might have (or just to say hi!), I am in the
                office during our normal business hours and am always available to you.
              </p>
              <p className="text-yellow-800 mt-2">
                Thank you for trusting us to represent you, we hope to never let you down!
              </p>
              <div className="mt-4">
                <img 
                  src="/images/signature.png" 
                  alt="Signature" 
                  className="h-16 w-auto"
                />
              </div>
              <p className="text-yellow-800 mt-2">
                <strong>Director of Operations/Marketing/Finance</strong>
              </p>
            </div>

            {/* Contract Images */}
            <div className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <img 
                  src="/images/termimage1.png" 
                  alt="Contract Information 1" 
                  className="w-full h-auto rounded-lg shadow-sm"
                />
                <img 
                  src="/images/termimage2.png" 
                  alt="Contract Information 2" 
                  className="w-full h-auto rounded-lg shadow-sm"
                />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contract Client Requirements</h2>
            <p className="text-gray-700 mb-4">Contract clients are those businesses who:</p>
            <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
              <li>Possess a valid EIN number</li>
              <li>Are in business to sell decorated garments as a print broker. (Clients must be able to provide a resale certificate from the state in which they operate and must service multiple clients, not just their business).</li>
              <li>Know enough about decoration processes to be able to price a job according to the art, the size of print, how many screens/colors/placements, quantities, etc. using our provided price lists and/or online quoter.</li>
              <li>Have established accounts for ordering the blank garments, which they will provide for their orders.</li>
              <li>Are able to provide print-ready (vector) artwork in Pantone (PMS) colors or provide PMS colors via the PO for their jobs. If unable to provide such files, art charges may apply.</li>
              <li>Have their own shipping accounts, which will be used to blind ship orders from SCC to clients.</li>
              <li>Spend a minimum of $5000 per quarter with us</li>
            </ul>

            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
              <p className="text-red-800">
                <strong>Note:</strong> We do not normally "quote" contract print jobs. Exceptions are made for raster print jobs
                (Photoshop files) that must be color separated.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">Setting Up An Account</h2>
            <p className="text-gray-700 mb-6">
              Prior to placing your first order new clients must complete the Contract Client Application, and one of the
              three payment terms forms. You must also submit a completed resale certificate from the state in which
              you operate that states you are in the business of selling garments. Once we receive all of the completed
              paperwork we will let you know that you are approved and ready to submit orders via our online order
              portal. Please be sure that you read the entire packet to ensure you are familiar with our policies and
              standards prior to placing your first order as this is a legally binding contract.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Turn Around Time</h2>
            <p className="text-gray-700 mb-6">
              We pride ourselves on our quick turn around time, however we can't make it happen without your help.
              Our turn around is dependent on clients sending all approvals and garments on time in order to meet our
              deadline requirements for your in hands date. Standard production time (7-10 business days during non
              peak seasons) starts once a client submits a complete order, all artwork, and tracking/confirmation for
              blank garments. In the event that client needs a job in less than the standard turn around times, RUSH
              services are available by SCC approval at the rates stated on the price lists.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">Submitting Orders/POs</h2>
            <p className="text-gray-700 mb-4">All contract clients must submit orders via our online order form through the SCC Client Portal. The only
              clients exempt from this policy are those companies who SCC has approved for automatic PO
              submission through their company's automated systems.</p>
            
            <p className="text-gray-700 mb-4">All order submissions must include:</p>
            <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
              <li>All required fields on the SCC online order form.</li>
              <li>Garment information for all styles, colors, sizes, and quantities on the order.</li>
              <li>"Print ready" art (see below) as well as color and placement information</li>
            </ul>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <p className="text-yellow-800">
                <strong>Important:</strong> Any orders submitted without all of the items listed above will be rejected, and the client will be expected
                to resubmit the order complete when ready.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">Acceptable Artwork for Screen Printing</h2>
            <p className="text-gray-700 mb-4">To avoid art charges, all artwork must be fully vectored with all fonts converted to outlines, and
              completely spot colored to Pantone C (PMS) spot colors. We only accept high-resolution jpegs (300 DPI
              minimum) or PSD files for jobs that are full-color simulated process. Art that is not provided in an
              acceptable format and therefore requires editing will result in art fees. We aren't responsible for the
              outcome of client-provided full-color simulated process separations. Please discuss with SCC prior to
              sending separation files to ensure they meet our requirements.</p>

            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
              <p className="text-red-800">
                <strong>Legal Notice:</strong> We assume clients have the legal right to use any and all art that is sent to us, and therefore SCC will
                assume no responsibility for copyright infringement or other legal issues.
              </p>
              <p className="text-red-800 mt-2">
                SCC reserves the right to reject any art files that we feel will result in poor decoration quality.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Terms</h2>
            <p className="text-gray-700 mb-6">
              Payment terms are established during the application process. We offer three payment options:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
              <li><strong>ACH Payments:</strong> Automatic bank account debits</li>
              <li><strong>Auto CC Charge:</strong> Automatic credit card charges with 3% processing fee</li>
              <li><strong>Net 15:</strong> Net 15 terms with backup credit card authorization</li>
            </ul>

            <div className="bg-gray-50 p-6 rounded-lg mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              <p className="text-gray-700">
                <strong>Stitches Clothing Co</strong><br />
                990 Spice Island Dr., Sparks, NV 89431<br />
                Phone: (775) 355-9161<br />
                Email: <a href="mailto:Info@StitchesClothingCo.com" className="text-blue-600 hover:text-blue-800">Info@StitchesClothingCo.com</a>
              </p>
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                This is a summary of key terms. Please download the full PDF for complete terms and conditions.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
