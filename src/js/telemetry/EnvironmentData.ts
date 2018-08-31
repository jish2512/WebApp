export class EnvironmentData {
	public EnvironmetName;
	public ServiceOffering;
	public ServiceLine;
	public Program;
	public Capability;
	public ComponentName;
	public AppName;
	public IctoId;
	public BusinessProcessName;

	constructor(private environmentName: string, private serviceOffering: string, private serviceLine: string, private program: string, private capability: string, private componentName: string, private appName: string, private ictoId: string, private businessProcessName: string) {
		this.EnvironmetName = environmentName;
		this.ServiceOffering = serviceOffering;
		this.ServiceLine = serviceLine;
		this.Program = program;
		this.Capability = capability;
		this.ComponentName = componentName;
		this.AppName = appName;
		this.IctoId = ictoId;
		this.BusinessProcessName = businessProcessName;
	}
}