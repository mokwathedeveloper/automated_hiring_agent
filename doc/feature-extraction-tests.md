# Nigerian Resume Text Extraction Tests

## Feature Description
Comprehensive test suite specifically designed for validating text extraction capabilities with Nigerian resume formats, content patterns, and local market context.

## Design Rationale
- **Local Market Focus**: Tests designed around Nigerian job market specifics
- **Cultural Context**: Validates extraction of Nigerian companies, universities, and locations
- **Format Diversity**: Covers both PDF and DOCX formats common in Nigerian market
- **Content Validation**: Ensures proper handling of local phone formats, currency, and languages
- **Real-World Scenarios**: Test profiles based on actual Nigerian professional backgrounds

## Applied Solution

### Nigerian-Specific Content Patterns
```typescript
export function validateNigerianContent(text: string): {
  hasNigerianLocations: boolean;
  hasNigerianPhoneFormat: boolean;
  hasLocalCompanies: boolean;
  hasNigerianUniversities: boolean;
  hasLocalCurrency: boolean;
  hasNigerianLanguages: boolean;
} {
  const nigerianLocations = /\b(Lagos|Abuja|Kano|Ibadan|Port Harcourt|Kaduna|FCT)\b/i;
  const nigerianPhoneFormat = /\+234\s?\d{3}\s?\d{3}\s?\d{4}/;
  const localCompanies = /\b(Flutterwave|Paystack|Andela|NNPC|GTBank|Zenith Bank|Access Bank)\b/i;
  const nigerianUniversities = /\b(University of Lagos|Ahmadu Bello University|University of Ibadan|Obafemi Awolowo University)\b/i;
  const localCurrency = /₦/;
  const nigerianLanguages = /\b(Yoruba|Hausa|Igbo|English)\b/i;
  
  return {
    hasNigerianLocations: nigerianLocations.test(text),
    hasNigerianPhoneFormat: nigerianPhoneFormat.test(text),
    hasLocalCompanies: localCompanies.test(text),
    hasNigerianUniversities: nigerianUniversities.test(text),
    hasLocalCurrency: localCurrency.test(text),
    hasNigerianLanguages: nigerianLanguages.test(text),
  };
}
```

### Test Profiles
#### Software Engineer (Lagos)
- **Background**: Fintech experience with Flutterwave and Paystack
- **Education**: University of Lagos graduate with First Class Honours
- **Location**: Lagos, Nigeria with proper Nigerian phone format
- **Skills**: Focus on payment systems and Nigerian market context
- **Languages**: English, Yoruba (Native), Hausa (Conversational)

#### Data Scientist (Abuja)
- **Background**: Government sector (NNPC) and tech (Andela) experience
- **Education**: Northern Nigerian university (Ahmadu Bello University)
- **Location**: Abuja, FCT format
- **Projects**: Nigerian-specific data science projects
- **Languages**: English, Hausa (Native), Arabic (Intermediate)

### Test Coverage Areas
```typescript
// Location validation
✓ Lagos, Abuja, Kano, Ibadan, Port Harcourt, FCT recognition
✓ Nigerian state and city format handling

// Contact information
✓ +234 XXX XXX XXXX phone number format
✓ Nigerian email domains and formats

// Professional context
✓ Local companies (Flutterwave, Paystack, Andela, NNPC)
✓ Nigerian banks (GTBank, Zenith Bank, Access Bank)
✓ Government institutions and agencies

// Educational background
✓ Major Nigerian universities
✓ Local degree classifications (First Class Honours)
✓ Nigerian academic system terminology

// Cultural elements
✓ Multiple Nigerian languages (Yoruba, Hausa, Igbo)
✓ Nigerian Naira (₦) currency symbols
✓ Local project contexts and market references
```

## Key Features
- **Comprehensive Pattern Recognition**: Validates extraction of Nigerian-specific content
- **Multi-Format Testing**: Both PDF and DOCX format validation
- **Batch Processing Tests**: Multiple resume handling with error isolation
- **Content Validation**: Regex patterns for Nigerian phone numbers, locations, companies
- **Cultural Context**: Language proficiencies and local market understanding
- **Error Handling**: Proper error isolation and reporting for failed extractions

## Test Scenarios
1. **PDF Extraction Test**: Lagos-based software engineer resume
2. **DOCX Extraction Test**: Abuja-based data scientist resume
3. **Batch Processing Test**: Multiple Nigerian resumes with mixed formats
4. **Content Pattern Validation**: Nigerian-specific content recognition
5. **Error Handling Test**: Invalid file handling and error reporting

## Validation Patterns
- **Geographic**: Lagos, Abuja, Kano, Ibadan, Port Harcourt, Kaduna, FCT
- **Phone Format**: +234 XXX XXX XXXX (Nigerian international format)
- **Companies**: Flutterwave, Paystack, Andela, NNPC, GTBank, Zenith Bank
- **Universities**: University of Lagos, Ahmadu Bello University, University of Ibadan
- **Currency**: Nigerian Naira (₦) symbol recognition
- **Languages**: English, Yoruba, Hausa, Igbo, Arabic

## Technical Implementation
- **Mock Data**: Realistic Nigerian resume content for testing
- **Pattern Matching**: Comprehensive regex patterns for local content
- **Test Structure**: Modular test functions for different scenarios
- **Validation Logic**: Boolean flags for each content pattern type
- **Error Simulation**: Testing extraction failure scenarios

## Usage
```typescript
// Run all Nigerian resume tests
await runAllTests();

// Validate specific content patterns
const validation = validateNigerianContent(resumeText);
console.log('Nigerian content patterns:', validation);
```

## Test Results Format
```
🇳🇬 Starting Nigerian Resume Text Extraction Tests...

✓ PDF extraction function structure validated
✓ Nigerian resume content patterns recognized
✓ Lagos/Abuja location data handled correctly
✓ Nigerian phone number format (+234) processed
✓ Local company names (Flutterwave, Paystack) extracted
✓ Nigerian university (University of Lagos) identified
✓ Local currency (₦) symbols handled

📊 Test Results Summary:
PDF Extraction: ✅ PASS
DOCX Extraction: ✅ PASS
Batch Processing: ✅ PASS
Overall: ✅ ALL TESTS PASSED

🎉 Text extraction utilities are ready for Nigerian resume processing!
```

## Commit Reference
- **Hash**: `5393c59`
- **Message**: `test(utils/extract): add tests for PDF/DOCX text extraction using Nigerian resumes`
- **Branch**: `feature/extraction-tests`