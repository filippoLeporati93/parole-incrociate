import logging

import azure.functions as func
from engine.Engine import Engine
import json

def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Compute Grid POST call started')

    req_body = req.get_json()
    grid = json.loads(req_body.get('grid'))
    letter = req_body.get('letter')

    eng = Engine(grid, letter)
    next_grid, next_letter = eng.compute_next_grid()

    logging.info('Compute Grid POST call ended')
    
    return func.HttpResponse(json.dumps({
        "letter": next_letter,
        "grid": next_grid
    }))