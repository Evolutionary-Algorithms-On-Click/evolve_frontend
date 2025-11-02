# evolve-frontend

<img width="1265" height="1280" alt="image" src="https://github.com/user-attachments/assets/a3f2fbbe-63cb-4983-9079-c071bb1ed97c" />


## Setup ENV

Create a `.env` file in the root directory of the project and add the following environment variables:

```env
NEXT_PUBLIC_AUTH_BASE_URL=<auth_microservice_base_url>
NEXT_PUBLIC_BACKEND_BASE_URL=<runner_controller_microservice_base_url>
NEXT_PUBLIC_MINIO_BASE_URL=<minio_base_url>
NEXT_PUBLIC_AI=<true/false> # If you want to use AI features
GOOGLE_GENERATIVE_AI_API_KEY=<google_generative_ai_api_key> # If you want to use AI features
```

## Installation

```bash
npm install
```

## Run in Development Mode

```bash
npm run dev
```

## Run in Production Mode

```bash
npm run build && npm run start
```

## Citation

If you use EvOC in your research, please cite:

```bibtex
@inproceedings{10.1145/3712255.3726652,
  author = {Murali, Ritwik and Sivamani, Ashwin Narayanan and Ramakrishnan, Abhinav and Arul, Hariharan and R, Ananya},
  title = {Evolve On Click (EvOC) - An Intuitive Web Platform to Collaboratively Implement, Execute, and Visualize Evolutionary Algorithms},
  year = {2025},
  isbn = {9798400714641},
  publisher = {Association for Computing Machinery},
  address = {New York, NY, USA},
  url = {https://doi.org/10.1145/3712255.3726652},
  doi = {10.1145/3712255.3726652},
  abstract = {This paper proposes "Evolve On Click" (EvOC) - an open-source intuitive web-based platform to simplify the implementation, execution, and visualization of Evolutionary Algorithms (EAs) including genetic programming, by providing a user-friendly interface. This facilitates easier accessibility of evolutionary algorithm software packages such as DEAP, to users with minimal programming experience. EvOC guides users through the EA design process, allowing them to experiment with different algorithms, parameters, and configurations without the need for programming expertise. The platform also incorporates features to show code created based on the configuration so that users can also learn from it, thus enhancing collaboration and enabling users to easily share their results with others. The architecture used by EvOC also supports ease of access for parallel and distributed EAs with real-time log streaming / monitoring and visualization of the evolution runs. By incorporating the latest DevOps techniques during the development process, EvOC does not require extensive maintenance and allows for the platform to be run as a service, supporting multiple users on a single instance. This paper details the design, implementation, and evaluation of EvOC towards increasing accessibility and ease of comfort with EAs for novice learners - thus broadening the reach of the community.},
  booktitle = {Proceedings of the Genetic and Evolutionary Computation Conference Companion},
  pages = {147–150},
  numpages = {4},
  keywords = {evolutionary algorithms, distributed artificial intelligence, distributed evolutionary algorithms in python, DEAP, software architectures, evolutionary computation},
  location = {NH Malaga Hotel, Malaga, Spain},
  series = {GECCO '25 Companion}
}
```
