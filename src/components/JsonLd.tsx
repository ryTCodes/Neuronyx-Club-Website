export default function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "EducationalOrganization",
        "@id": "https://neuronyx.aiktc.ac.in/#organization",
        name: "NeurOnyx ACM Student Chapter",
        alternateName: [
          "NeurOnyx Club",
          "NeurOnyx AIKTC",
          "ACM NeurOnyx",
          "NeurOnyx AI & ML Club",
        ],
        url: "https://neuronyx.aiktc.ac.in",
        logo: "https://neuronyx.aiktc.ac.in/logo.png",
        image: "https://neuronyx.aiktc.ac.in/logo.png",
        description:
          "Official ACM Student Chapter of the Department of Computer Science & Engineering (Artificial Intelligence & Machine Learning) at Anjuman-I-Islam's Kalsekar Technical Campus (AIKTC), New Panvel.",
        parentOrganization: {
          "@type": "CollegeOrUniversity",
          name: "Anjuman-I-Islam's Kalsekar Technical Campus",
          url: "https://aiktc.ac.in",
        },
        department: {
          "@type": "EducationalOrganization",
          name: "Department of Computer Science & Engineering (AI & ML)",
        },
        address: {
          "@type": "PostalAddress",
          streetAddress:
            "Plot No. 2 & 3, Sector 16, Near Thana Naka, Khandagaon",
          addressLocality: "New Panvel, Navi Mumbai",
          addressRegion: "Maharashtra",
          postalCode: "410206",
          addressCountry: "IN",
        },
        sameAs: [
          "https://www.linkedin.com/company/neuronyx-club/",
          "https://www.instagram.com/neuronyx_aiktc",
          "https://aiktc.ac.in",
        ],
      },
      {
        "@type": "WebSite",
        "@id": "https://neuronyx.aiktc.ac.in/#website",
        url: "https://neuronyx.aiktc.ac.in",
        name: "NeurOnyx AIKTC",
        description:
          "Official website of NeurOnyx ACM Student Chapter at AIKTC New Panvel.",
        publisher: {
          "@id": "https://neuronyx.aiktc.ac.in/#organization",
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
