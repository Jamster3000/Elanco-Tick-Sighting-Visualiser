# READ ME! 
> FOR the Marker/lecture that is wanting to run this project.
>
> Below outlines the steps needed to run the correct version of the code, what tools are needed, what needs to be installed, etc. We will assume you are using visual studio for the purpose of these instructions.

# Tools required
- IDE (We suggest Visual studio 2022 or 2026 as that is what our team used together.
- [Node.js](https://nodejs.org/en/download) - This is required to build and run the frontend code.
- `ASP.net` and `DOTNET 8` will be required on your system in order to run the backend

# Getting a local copy of the code
1. Towards the top right where the green `code` button is, open this and either copy the `HTTPS clone link` or `open in visual studio` both lead you to cloning the files.
2. Once cloned in visual studio and confirmed that there are some files present in the `Solution Explorer` -> Go to the bottom right of visual studio
    <img width="912" height="292" alt="image" src="https://github.com/user-attachments/assets/0f531a06-f52d-4e06-81b2-119972f62b78" />

   Where it says `main` click this, go to `remote branches` tab, and choose the branch called `New-Map-Revamp`. This branch is our current branch with the newest and most      up to date code for our project. Depending on your machine and network availability, this could take some time. This is due to some data files that are larger than Github's standard 100MB size. In any case, perhaps make yourself tea whilst you wait.

# Running the backend
1. In visual studio's `solution explorer` double click on the file called `ElantroProj.slnx`. This will initiate the backend framework with visual studio.
2. Once visual studio has processed this -> You should see at the top a green arrow button which says `HTTPS`
       <img width="693" height="80" alt="image" src="https://github.com/user-attachments/assets/d8a0d40b-4ede-4730-a639-a47003669ff9" />
       If it says something other than `HTTPS`, please use the dropdown next to it to change it to this.
3. Press the button to run. If this is the first run on your machine it may take a couple of minutes to build, compile and run (running takes the longest) -> yet again, plenty of time to brew another tea.
4. If all goes well, You should have a terminal like window open. Please leave this running until you have finished with the frontend. Closing visual studio will also stop the backend running.
    <img width="1734" height="927" alt="image" src="https://github.com/user-attachments/assets/2fe6f638-c557-47b6-9bb5-9d22fc81656f" />

# Running the frontend
1. Open a terminal (ideally, we suggest a `Developer PowerShell` in visual studio) -> use CD or make sure you're in the project root directory.
2. Run `cd vue-client` -> this is where all the frontend code lives.
3. Run `npm install` -> This will install all libraries/packages this project uses in the frontend (e.g., leaflet.js for the map functionality) - (If you are quick at making tea, here's your third opportunity).
4. If there are no errors (you may get some warnings but these are okay and shouldn't interrupt running the frontend), you can then run the frontend with `npm run dev`.
5. It should be clear once the frontend is running as the command shows coloured text and all the basic information needed whilst it is running. Now to visit the web app, it should tell you the localhost address to visit (e.g., `http://localhost:5173/` - This should be exactly same as yours). Copy and paste this into any web browser of your choice.

# Confirm the frontend communicates with backend
> This might be obvious, but it's always to check.

1. Simply head to another page (we suggest going to the `Explore Tick Species` page).
2. If you see images, a card, and information about ticks, then the frontend has successfully communicated with the backend and all is working as intended.
   IF you don't see these. Please check your developer console (Chrome based web browsers `Ctrl+Shift+I`), backend terminal, and frontend terminal to see if there are any obvious errors that can be fixed.
3. Certain things like firewall or antivirus are common things that often intercept development builds and are known to cause a lot of problems.

> And of course, there's always time to stop throughout this process for more tea.

<br><br>
---
<br><br>

# Portfolio
Access the Portfolio document below with the link:
[Portfoio group project word doc](https://sheffieldhallam-my.sharepoint.com/:w:/g/personal/c5026574_hallam_shu_ac_uk/IQCxRbF484p_QZEAVyREyptmAT3KGKO0gT3tSYbJa2qlh1c?e=2CRuQi)

> Suggest opening it in word desktop for correct and proper formatting.

# Tick Sighting Visualiser

## Project Summary

Elanco is seeking to develop a methodology for the effective visualisation of tick sighting data across the
UK. A central component of this project involves addressing the inaccuracies within the provided dataset.
Your team will be tasked with demonstrating robust strategies for data cleaning, transformation, and
subsequent presentation to end-users in an informative and accessible manner. The ultimate objective is
to generate valuable insights into tick prevalence and distribution, thereby contributing to public health
awareness and animal welfare initiatives.

## Context

Ticks represent a significant concern within animal health, making a comprehensive understanding of their
geographical distribution critically important. Real-world datasets frequently present challenges such as
inconsistencies, missing values, and inaccuracies. This project offers a practical opportunity to confront
these common data quality issues and to develop user-centric solutions for their mitigation and
presentation.

## Core Tasks

Your team will be responsible for the following key deliverables:
**Data Review and Transformation:**
    - Conduct a comprehensive review of the provided tick sighting dataset.
    - Identify and systematically address data quality issues, including inaccuracies, inconsistencies, and missing data points.
    - Transform the raw data into a structured and clean format suitable for subsequent analysis and visualisation.
**Web Application Development:**
    - Develop a web-based interface to display the project's findings.
    - The interface must be designed for intuitive navigation and optimal user experience.
**User Insights and Information Dissemination:**
    - Based on the processed data, generate and present relevant insights and information to users.
    - This information should be contextualised or presented in a manner that is pertinent to a user's specified location (e.g., displaying tick prevalence within a defined geographical area).

## Extension Opportunities

For teams demonstrating exceptional progress and seeking to enhance the project's scope, the following
extensions are suggested:
    - **Interactive Mapping Functionality:** Implement an interactive map feature, enabling users to dynamically explore tick sighting data.
    - **Species-Specific Information Integration:** Incorporate detailed information regarding specific species of ticks, including their biological characteristics, typical habitats, and associated health risks.

## Deliverables

Upon project completion, your team is required to submit the following:

1. **Project Presentation:** A formal presentation detailing your methodological approach, challenges
    encountered, solutions implemented, and key insights derived from the data analysis.
2. **Functional Solution:** The developed web application, accompanied by all relevant source code and
    comprehensive documentation.

## Elanco Project Team

The following Elanco team members will provide guidance and support throughout the project:

- Tom Youngs - Engineer - tom.youngs@elancoah.com
- Liam Hammond - Data Engineer - liam.hammond@elancoah.com
- Samad Olaibi - Engineer - samad.olaibi@network.elancoah.com
- Luke Chapman - Data Engineer - luke.chapman@network.elancoah.com
