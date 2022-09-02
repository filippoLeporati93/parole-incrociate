import logging

import azure.functions as func
import Engine
import json

def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Engine POST call started')

    try:
        req_body = req.get_json()
    except ValueError:
        pass
    else:
        grid = req_body.get('grid')

    eng = Engine(json.loads(grid))
    next_grid = eng.compute_next_grid()
    
    return func.HttpResponse(json.dumps(next_grid))