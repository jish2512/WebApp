interface JQueryStatic{
    correlator: MSITCorrelator;
}

interface MSITCorrelator{
    getCorrelationId?() : string;
    setCorrelationId?(newId:string): void;
    renewCorrelationId?() : string;
}
