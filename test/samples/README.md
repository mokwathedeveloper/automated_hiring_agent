# Nigerian Resume Test Samples

This directory contains test samples and documentation for validating text extraction with Nigerian resumes.

## Test Coverage

### Nigerian-Specific Content Patterns
- **Locations**: Lagos, Abuja, Kano, Ibadan, Port Harcourt, FCT
- **Phone Formats**: +234 XXX XXX XXXX (Nigerian international format)
- **Companies**: Flutterwave, Paystack, Andela, NNPC, GTBank, Zenith Bank
- **Universities**: University of Lagos, Ahmadu Bello University, University of Ibadan
- **Currency**: Nigerian Naira (₦) symbols
- **Languages**: English, Yoruba, Hausa, Igbo

### Resume Profiles Tested
1. **Software Engineer (Lagos)**
   - Fintech experience (Flutterwave, Paystack)
   - University of Lagos graduate
   - Multiple Nigerian languages
   - Local currency handling

2. **Data Scientist (Abuja)**
   - Government sector experience (NNPC)
   - Northern Nigerian university (Ahmadu Bello)
   - Arabic language skills
   - FCT location format

## File Formats Validated
- ✅ PDF extraction with Nigerian content
- ✅ DOCX extraction with Nigerian content
- ✅ Batch processing multiple Nigerian resumes
- ✅ Error handling for Nigerian-specific characters

## Content Validation Patterns
The test suite validates extraction of:
- Nigerian phone number formats
- Local company names and institutions
- Geographic locations across Nigeria
- Currency symbols and local context
- Multiple language proficiencies
- Nigerian educational institutions

## Usage
Run the test suite to validate text extraction capabilities:
```bash
npm test
```

The tests ensure that the text extraction utilities properly handle Nigerian resume formats and content patterns commonly found in the local job market.