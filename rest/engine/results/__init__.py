import logging, json
from engine.Engine import Engine
import azure.functions as func


def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Compute Results POST call started')

    req_body = req.get_json()
    grid = json.loads(req_body.get('grid'))

    eng = Engine(grid)
    results = eng.calculate_results()

    logging.info('Compute Results POST call ended')
    
    return func.HttpResponse(json.dumps(results))