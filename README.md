This package is still in development phase so bugs may happen!

**A library to generate contracts in PDF with TypeScript.**

you can [catch me on LinkedIn](https://www.linkedin.com/in/ferlicio/)

# Getting started

First, you need to install it on your project:
```sh
npm install PDFContractGenerator
```

after installation, you can start setting up the generatePDF method:
```sh
import { PDFContractGenerator } from "PDFContractGenerator";

constructor(private contract:PDFContractGenerator) {}
```

From this on, you can generate a contract by using the generatePDF() function

The function requires the text to be passed in the function parameters along with optional parameters to format the contract text

# text Formatting
You can put text inside custom tags to change text font size or alignment, for example:
```sh
<c10> hello world, im testing it! </c10>
<j> you may need to justify what you are doing </j>
<r5> but i wish i was right... </r5>
```

Inside tags you can use 'c' for "centered", 'r' for "right alignment", 'j' for "justified" and 'l' for "left alignment"(default). You can also use numbers to adjust the font size of the text and both can be used together or alone.

The text outside tags use a default size of 15 and can be changed through tags or passing the 'fontSize' property when calling for the function


# usage example:
```sh
exampleText = `
<c10> i'm a freak! </c10>
<r5> i'm a weirdo... </r5>
<j> what the hell am i doing here? </j>
i dont belong here...
`

this.contract.generatePDF(exampleText,{fontSize:'15', marginTopBotton:'3'})
```
