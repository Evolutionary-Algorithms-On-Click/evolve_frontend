# evolve-frontend

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
@inproceedings{evoc2024gecco,
  author = {Prithiviraj Ashrock and Srivathsan S and Madhavan S},
  title = {EvOC: A Framework for Visualizing and Evolving Cellular Automata in Unity},
  year = {2024},
  isbn = {9798400706243},
  publisher = {Association for Computing Machinery},
  address = {New York, NY, USA},
  url = {[https://doi.org/10.1145/3712255.3726652](https://doi.org/10.1145/3712255.3726652)},
  doi = {10.1145/3712255.3726652},
  booktitle = {Proceedings of the Genetic and Evolutionary Computation Conference Companion},
  pages = {257–258},
  numpages = {2},
  location = {Melbourne, VIC, Australia},
  series = {GECCO '24 Companion}
}
